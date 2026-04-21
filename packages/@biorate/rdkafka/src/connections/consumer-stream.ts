import { EventEmitter } from 'events';
import {
  KafkaConsumer,
  ConsumerStream,
  Message,
  CODES,
} from '@confluentinc/kafka-javascript';
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

const DEFAULT_BUFFER_SIZE = 100;
const DEFAULT_CONCURRENCY = 10;
const DEFAULT_DELAY = 0;
const METRIC_STATUS_SUCCESS = 200;
const METRIC_STATUS_ERROR = 500;

/**
 * @description RDKafka consumer stream connection
 */
export class RDKafkaConsumerStreamConnection
  extends EventEmitter
  implements IRDKafkaProducerStreamConnection
{
  public stream: ConsumerStream;

  protected config: IRDKafkaConsumerStreamConfig;

  protected timer: NodeJS.Timeout | null = null;

  protected handler: ((message: Message | Message[]) => Promise<void> | void) | null =
    null;

  protected pool: Message[] = [];

  protected processing = false;

  protected stopped = false;

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

  protected offsets: Map<string, number> = new Map();

  protected get buffer() {
    return this.config.buffer ?? DEFAULT_BUFFER_SIZE;
  }

  protected get concurrency() {
    return this.config.concurrency ?? DEFAULT_CONCURRENCY;
  }

  protected get delay() {
    return this.config.delay ?? DEFAULT_DELAY;
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
            this.stream.consumer.assign(assignment);
          } else if (err.code === CODES.ERRORS.ERR__REVOKE_PARTITIONS) {
            this.stream.consumer.unassign();
          } else {
            throw err;
          }
        },
        ...this.config.global,
      },
      this.config.topic,
      this.config.stream,
    );
    this.handler = handler;
    this.stopped = false;
    this.stream.on('data', (message: Message) => this.#onData(message));
    this.stream.consumer.on('event.error', (e) => this.emit('error', e));
    this.timer = setInterval(() => this.#checkResume(), 100);
    this.processing = true;
    this.#handle().catch((e) => this.emit('error', e));
  }

  #onData(message: Message) {
    if (this.pool.length >= this.buffer) {
      this.stream.pause();
    }
    this.pool.push(message);
  }

  #checkResume() {
    if (!this.stopped && this.pool.length < this.buffer && !this.stream.isPaused()) {
      this.stream.resume();
    }
  }

  public async unsubscribe() {
    this.stopped = true;
    this.processing = false;
    this.stream.pause();
    this.stream.removeAllListeners('data');
    this.handler = null;
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    await promisify(this.stream.close.bind(this.stream));
  }

  #handle = async () => {
    while (!this.stopped) {
      try {
        await timer.wait(this.delay ?? 10);
        if (!this.pool.length) continue;
        const batch = this.pool.splice(0, this.concurrency);
        if (!batch.length) continue;
        await this.#processBatch(batch);
      } catch (e) {
        console.error('Consumer stream error:', e);
        this.emit('error', e);
      }
    }
  };

  async #processBatch(messages: Message[]) {
    const time = timeDiff();
    const tasks: Promise<unknown>[] = [];
    const latestByPartition = new Map<number, Message>();
    const metricCounter = new Map<string, number>();
    for (const message of messages) {
      if (!this.config.batch) {
        const result = this.handler!(message);
        if (result) tasks.push(result);
      }
      const prev = latestByPartition.get(message.partition);
      if (!prev || message.offset > prev.offset) {
        latestByPartition.set(message.partition, message);
      }
      const key = `${message.topic}\0${message.partition}`;
      metricCounter.set(key, (metricCounter.get(key) ?? 0) + 1);
    }
    if (this.config.batch) {
      const result = this.handler!(messages);
      if (result) tasks.push(result);
    }
    try {
      await Promise.all(tasks);
      for (const [, message] of latestByPartition) {
        this.stream.consumer.commitMessage(message);
        this.emit(EventsConsumerStream.LatestMessage, message);
      }
      this.#recordMetrics(metricCounter, METRIC_STATUS_SUCCESS, time());
    } catch (e) {
      this.pool.unshift(...messages);
      this.#recordMetrics(metricCounter, METRIC_STATUS_ERROR, time());
      throw e;
    }
  }

  #recordMetrics(counter: Map<string, number>, status: number, time: number) {
    for (const [key, count] of counter) {
      const [topic, partitionStr] = key.split('\0');
      const partition = Number(partitionStr);
      const assigned = this.assignment.find(
        (item) => item.topic === topic && item.partition === partition,
      );
      if (!assigned) continue;
      const labels = {
        topic,
        status,
        group: this.config.global['group.id'] || 'unknown',
        partition,
      };
      this.counter.labels(labels).inc(count);
      this.histogram.labels(labels).observe(time);
    }
  }
}
