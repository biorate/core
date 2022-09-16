import { EventEmitter } from 'events';
import { timer } from '@biorate/tools';
import { KafkaConsumer, ConsumerStream, Message } from 'node-rdkafka';
import { EventsConsumerStream } from '../enums';
import {
  IRDKafkaConsumerStreamConfig,
  IRDKafkaProducerStreamConnection,
} from '../interfaces';
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

  protected get buffer() {
    return this.config.buffer ?? 100;
  }

  protected get concurrency() {
    return this.config.concurrency ?? 10;
  }

  public constructor(config: IRDKafkaConsumerStreamConfig) {
    super();
    this.config = config;
    this.stream = KafkaConsumer.createReadStream(
      config.global,
      config.topic,
      config.stream,
    );
    this.stream.pause();
    this.#handle();
  }

  public subscribe(handler: (message: Message | Message[]) => Promise<void>) {
    this.handler = handler;
    this.stream.on('data', (message: Message) => {
      if (this.pool.length >= this.buffer) this.stream.pause();
      this.pool.push(message);
    });
    this.timer = setInterval(() => {
      if (this.pool.length < this.buffer) this.stream.resume();
    });
    this.started = true;
    this.stream.resume();
  }

  public unsubscribe() {
    this.started = false;
    this.stream.pause();
    this.stream.removeAllListeners('data');
    clearInterval(this.timer);
    this.handler = null;
  }

  #handle = async () => {
    const latest = new Map<number, Message>();
    const tasks = [];
    while (true) {
      try {
        await timer.wait();
        if (!this.started) continue;
        if (!this.pool.length) continue;
        latest.clear();
        tasks.length = 0;
        const messages = this.pool.splice(0, this.concurrency);
        for (const message of messages) {
          if (!this.config.batch) tasks.push(this.handler!(message));
          const prev = latest.get(message.partition);
          const last = !prev || message.offset > prev.offset ? message : prev;
          latest.set(message.partition, last);
        }
        if (this.config.batch) tasks.push(this.handler!(messages));
        await Promise.all(tasks);
        for (const [, message] of latest) {
          this.stream.consumer.commitMessage(message);
          this.emit(EventsConsumerStream.LatestMessage, message);
        }
      } catch (e) {
        console.error(e);
      }
    }
  };
}
