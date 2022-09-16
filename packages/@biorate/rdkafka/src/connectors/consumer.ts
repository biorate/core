import { injectable } from '@biorate/inversion';
import { Connector } from '@biorate/connector';
import { RDKafkaConsumerCantConnectError } from '../errors';
import { RDKafkaConsumerConnection } from '../connections';
import { IRDKafkaConsumerConfig, IRDKafkaConsumerConnection } from '../interfaces';
/**
 * @description RDKafka consumer connector
 *
 * ### Features:
 * - consumer connector manager for node-rdkafka
 *
 * @example
 * ```
 * ```
 */
@injectable()
export class RDKafkaConsumerConnector extends Connector<
  IRDKafkaConsumerConfig,
  IRDKafkaConsumerConnection
> {
  /**
   * @description Namespace path for fetching configuration
   */
  protected readonly namespace = 'RDKafkaConsumer';
  /**
   * @description Create connection
   */
  protected async connect(config: IRDKafkaConsumerConfig) {
    let connection: IRDKafkaConsumerConnection;
    try {
      connection = new RDKafkaConsumerConnection(config.global, config.topic);
      await connection.connectPromise();
    } catch (e: unknown) {
      throw new RDKafkaConsumerCantConnectError(<Error>e);
    }
    return connection;
  }
}
