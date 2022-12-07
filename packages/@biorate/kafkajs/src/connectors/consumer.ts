import { chunk, omit } from 'lodash';
import { injectable } from '@biorate/inversion';
import { Connector } from '@biorate/connector';
import { Kafka, Batch, KafkaMessage } from 'kafkajs';
import { counter, Counter, histogram, Histogram } from '@biorate/prometheus';
import { IKafkaJSConsumerConfig, IKafkaJSConsumerConnection } from '../interfaces';
import { KafkaJSConsumerCantConnectError } from '../errors';
import { LogCreator } from '../logger';
/**
 * @description KafkaJS consumer connector
 *
 * ### Features:
 * - consumer connector manager for KafkaJS
 *
 * @example
 * ```
 * ```
 */
@injectable()
export class KafkaJSConsumerConnector extends Connector<
  IKafkaJSConsumerConfig,
  IKafkaJSConsumerConnection
> {
  /**
   * @description Counter
   */
  @counter({
    name: 'kafkajs_consumer_seconds_count',
    help: 'Kafkajs consumer seconds count',
    labelNames: ['topic', 'status'],
  })
  protected counter: Counter;
  /**
   * @description Histogram
   */
  @histogram({
    name: 'kafkajs_consumer_seconds',
    help: 'kafkajs consumer seconds bucket',
    labelNames: ['topic', 'status'],
    buckets: [5, 10, 20, 50, 100, 300, 500, 1000, 2000, 3000, 5000, 10000],
  })
  protected histogram: Histogram;
  /**
   * @description Namespace path for fetching configuration
   */
  protected readonly namespace = 'KafkaJSConsumer';
  /**
   * @description configs
   */
  protected readonly configs = new Map<string, IKafkaJSConsumerConfig>();
  /**
   * @description Create connection
   */
  protected async connect(config: IKafkaJSConsumerConfig) {
    let connection: IKafkaJSConsumerConnection;
    try {
      this.configs.set(config.name, config);
      connection = new Kafka({ logCreator: LogCreator, ...config.global }).consumer(
        config.options,
      );
      await connection.connect();
    } catch (e: unknown) {
      throw new KafkaJSConsumerCantConnectError(<Error>e);
    }
    return connection;
  }
  /**
   * @description On catch error
   */
  protected async catch(
    e: Error,
    messages: KafkaMessage[],
    batch: Omit<Batch, 'messages'>,
  ) {
    throw e;
  }
  /**
   * @description Unsubscribe
   */
  public async unsubscribe(name: string) {
    await this.get(name).disconnect();
  }
  /**
   * @description Subscribe
   */
  public async subscribe(
    name: string,
    handler: (messages: KafkaMessage[], batch: Omit<Batch, 'messages'>) => Promise<void>,
  ) {
    const consumer = this.get(name);
    const config = this.configs.get(name)!;
    await consumer.subscribe(this.configs.get(name)!.subscribe!);
    const process = consumer.run({
      ...(config!.runConfig ?? {}),
      eachBatch: async ({ batch, heartbeat }) => {
        const topic = batch.topic;
        const chunks = chunk(batch.messages, config?.concurrency ?? 1);
        consumer.pause([{ topic }]);
        for (const messages of chunks) {
          const start = Date.now();
          try {
            await handler(messages, omit(batch, 'messages'));
            this.histogram.labels({ topic, status: 200 }).observe(Date.now() - start);
            this.counter.labels({ topic, status: 200 }).inc(messages.length);
          } catch (e) {
            this.histogram.labels({ topic, status: 400 }).observe(Date.now() - start);
            this.counter.labels({ topic, status: 400 }).inc(messages.length);
            await this.catch(<Error>e, messages, omit(batch, 'messages'));
          }
          await heartbeat();
        }
        consumer.resume([{ topic }]);
      },
    });
    return process;
  }
}
