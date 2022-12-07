import { chunk, omit } from 'lodash';
import { injectable } from '@biorate/inversion';
import { Connector } from '@biorate/connector';
import { Kafka, Batch, KafkaMessage } from 'kafkajs';
import { IKafkaJSConsumerConfig, IKafkaJSConsumerConnection } from '../interfaces';
import { KafkaJSConsumerCantConnectError } from '../errors';
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
      connection = new Kafka(config.global).consumer(config.options);
      await connection.connect();
    } catch (e: unknown) {
      throw new KafkaJSConsumerCantConnectError(<Error>e);
    }
    return connection;
  }
  /**
   * @description Unsubscribe
   */
  public unsubscribe(name: string) {
    return this.get(name).disconnect();
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
          await handler(messages, omit(batch, 'messages'));
          await heartbeat();
        }
        consumer.resume([{ topic }]);
      },
    });
    return process;
  }
}
