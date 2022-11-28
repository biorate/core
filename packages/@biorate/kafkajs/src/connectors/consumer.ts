import { injectable } from '@biorate/inversion';
import { Connector } from '@biorate/connector';
import { Kafka } from 'kafkajs';
import { KafkaJSConsumerCantConnectError } from '../errors';
import { IKafkaJSConsumerConfig, IKafkaJSConsumerConnection } from '../interfaces';
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
   * @description Create connection
   */
  protected async connect(config: IKafkaJSConsumerConfig) {
    let connection: IKafkaJSConsumerConnection;
    try {
      connection = new Kafka(config.global).consumer(config.options);
      await connection.connect();
    } catch (e: unknown) {
      throw new KafkaJSConsumerCantConnectError(<Error>e);
    }
    return connection;
  }
}
