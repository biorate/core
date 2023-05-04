import { injectable } from '@biorate/inversion';
import { Connector } from '@biorate/connector';
import { RDKafkaProducerCantConnectError } from '../errors';
import { RDKafkaProducerConnection } from '../connections';
import { IRDKafkaProducerConfig, IRDKafkaProducerConnection } from '../interfaces';
/**
 * @description RDKafka producer connector
 *
 * ### Features:
 * - producer connector manager for node-rdkafka
 *
 * @example
 * ```
 * ```
 */
@injectable()
export class RDKafkaProducerConnector extends Connector<
  IRDKafkaProducerConfig,
  IRDKafkaProducerConnection
> {
  /**
   * @description Private connections storage
   */
  private '#connections': Map<string, IRDKafkaProducerConnection>;
  /**
   * @description Private link to selected (used) connection
   */
  private '#current': IRDKafkaProducerConnection | undefined;
  /**
   * @description Namespace path for fetching configuration
   */
  protected readonly namespace = 'RDKafkaProducer';
  /**
   * @description Create connection
   */
  protected async connect(config: IRDKafkaProducerConfig) {
    let connection: IRDKafkaProducerConnection;
    try {
      connection = new RDKafkaProducerConnection(config.global, config.topic);
      connection.setPollInterval(config.pollInterval ?? 100);
      await connection.connectPromise();
    } catch (e: unknown) {
      throw new RDKafkaProducerCantConnectError(<Error>e);
    }
    return connection;
  }
}
