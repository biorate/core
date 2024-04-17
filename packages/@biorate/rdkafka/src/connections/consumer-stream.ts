import { EventEmitter } from 'events';
import { KafkaConsumer, ConsumerStream, Message, CODES } from 'node-rdkafka';
import { timer } from '@biorate/tools';
import { counter, Counter, histogram, Histogram } from '@biorate/prometheus';
import { EventsConsumerStream } from '../enums';
import { RDKafkaConsumerStreamAlreadySubscribedError } from '../errors';
import { timeDiff } from '../helpers';
import {
  IRDKafkaConsumerStreamConfig,
  IRDKafkaProducerStreamConnection,
} from '../interfaces';
import { promisify } from 'util';
/**
 * @description RDKafka consumer stream connection
 */
export class RDKafkaConsumerStreamConnection
  extends EventEmitter
  implements IRDKafkaProducerStreamConnection
{
  public stream: ConsumerStream;
  protected config: IRDKafkaConsumerStreamConfig;
  protected timer: NodeJS.Timer;
  protected handler: ((message: Message | Message[]) => Promise<void> | void) | null =
    null;
  protected pool: Message[] = [];
  protected started = false;
  @counter({
    name: 'kafka_consumer_count',
    help: 'Kafka consumer count',
    labelNames: ['topic', 'status', 'group', 'partition'],
  })
  protected counter: Counter;
  @histogram({
    name: 'kafka_consumer_seconds',
    help: 'kafka consumer seconds bucket',
    labelNames: ['topic', 'status', 'group', 'partition'],
    buckets: [5, 10, 20, 50, 100, 300, 500, 1000, 2000, 3000, 5000, 10000],
  })
  protected histogram: Histogram;

  protected assignment: { topic: string; partition: number }[] = [];

  protected get buffer() {
    return this.config.buffer ?? 100;
  }

  protected get concurrency() {
    return this.config.concurrency ?? 10;
  }

  protected get delay() {
    return this.config.delay ?? 0;
  }

  public constructor(config: IRDKafkaConsumerStreamConfig) {
    super();
    this.config = config;
  }

  public subscribe(handler: (message: Message | Message[]) => Promise<void>) {
    if (this.handler) throw new RDKafkaConsumerStreamAlreadySubscribedError();
    this.stream = KafkaConsumer.createReadStream(
      {
        rebalance_cb: (
          err: Error & { code: number },
          assignment: { topic: string; partition: number }[],
        ) => {
          this.assignment.length = 0;
          if (err.code === CODES.ERRORS.ERR__ASSIGN_PARTITIONS) {
            this.assignment = assignment;
            // Note: this can throw when you are disconnected. Take care and wrap it in
            // a try catch if that matters to you
            this.stream.consumer.assign(assignment);
          } else if (err.code === CODES.ERRORS.ERR__REVOKE_PARTITIONS) {
            // Same as above
            this.stream.consumer.unassign();
          } else {
            // We had a real error
            throw err;
          }
        },
        ...this.config.global,
      },
      this.config.topic,
      this.config.stream,
    );
    this.handler = handler;
    this.stream.on('data', (message: Message) => {
      if (this.pool.length >= this.buffer) this.stream.pause();
      this.pool.push(message);
    });
    this.timer = setInterval(() => {
      if (this.pool.length < this.buffer) this.stream.resume();
    });
    this.started = true;
    this.#handle();
  }

  public async unsubscribe() {
    this.stream.pause();
    this.stream.removeAllListeners('data');
    this.started = false;
    this.handler = null;
    clearInterval(this.timer);
    await promisify(this.stream.close.bind(this.stream));
  }

  #handle = async () => {
    let messages: Message[] = [];
    let time: () => number;
    const latest = new Map<number, Message>();
    const counter = new Map<string, number>();
    const tasks = [];
    while (true) {
      try {
        await timer.wait(this.delay);
        if (!this.started) continue;
        if (!this.pool.length) continue;
        time = timeDiff();
        latest.clear();
        counter.clear();
        messages.length = 0;
        tasks.length = 0;
        messages.push(...this.pool.splice(0, this.concurrency));
        for (const message of messages) {
          if (!this.config.batch) tasks.push(this.handler!(message));
          const prev = latest.get(message.partition);
          const last = !prev || message.offset > prev.offset ? message : prev;
          latest.set(message.partition, last);
          counter.set(
            `${message.topic}_${message.partition}`,
            (counter.get(message.topic) ?? 0) + 1,
          );
        }
        if (this.config.batch) tasks.push(this.handler!(messages));
        await Promise.all(tasks);
        for (const [, message] of latest) {
          this.stream.consumer.commitMessage(message);
          this.emit(EventsConsumerStream.LatestMessage, message);
        }
        this.#setMetrics(counter, 200, time());
      } catch (e) {
        counter.clear();
        for (const message of messages)
          counter.set(message.topic, (counter.get(message.topic) ?? 0) + 1);
        this.#setMetrics(counter, 500, time!());
        console.error(e);
      }
    }
  };

  #setMetrics = (counter: Map<string, number>, status: number, time: number) => {
    for (const [key, count] of counter) {
      const [topic, partition] = key.split('_');
      for (const item of this.assignment) {
        if (topic !== item.topic || Number(partition) !== item.partition) continue;
        const labels = {
          topic,
          status,
          group: this.config.global['group.id'] || 'unknown',
          partition: item.partition,
        };
        this.counter.labels(labels).inc(count);
        this.histogram.labels(labels).observe(time);
      }
    }
  };
}
