import { injectable } from '@biorate/inversion';
import { Connector } from '@biorate/connector';
import { Kafka, Partitioners } from 'kafkajs';
import { KafkaJSProducerCantConnectError } from '../errors';
import { IKafkaJSProducerConfig, IKafkaJSProducerConnection } from '../interfaces';
/**
 * @description KafkaJS producer connector
 *
 * ### Features:
 * - producer connector manager for KafkaJS
 *
 * @example
 * ```
 * ```
 */
@injectable()
export class KafkaJSProducerConnector extends Connector<
  IKafkaJSProducerConfig,
  IKafkaJSProducerConnection
> {
  /**
   * @description Namespace path for fetching configuration
   */
  protected readonly namespace = 'KafkaJSProducer';
  /**
   * @description Create connection
   */
  protected async connect(config: IKafkaJSProducerConfig) {
    let connection: IKafkaJSProducerConnection;
    try {
      connection = new Kafka(config.global).producer({
        createPartitioner: Partitioners[config.partitioner ?? 'DefaultPartitioner'],
        ...config.options,
      });
      await connection.connect();
    } catch (e: unknown) {
      throw new KafkaJSProducerCantConnectError(<Error>e);
    }
    return connection;
  }
}
