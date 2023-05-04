import { injectable } from '@biorate/inversion';
import { Connector } from '@biorate/connector';
import { RDKafkaHighLevelProducerCantConnectError } from '../errors';
import { RDKafkaHighLevelProducerConnection } from '../connections';
import {
  IRDKafkaHighLevelProducerConfig,
  IRDKafkaHighLevelProducerConnection,
} from '../interfaces';
/**
 * @description RDKafka high level producer connector
 *
 * ### Features:
 * - high level producer connector manager for node-rdkafka
 *
 * @example
 * ```
 * ```
 */
@injectable()
export class RDKafkaHighLevelProducerConnector extends Connector<
  IRDKafkaHighLevelProducerConfig,
  IRDKafkaHighLevelProducerConnection
> {
  /**
   * @description Private connections storage
   */
  private '#connections': Map<string, IRDKafkaHighLevelProducerConnection>;
  /**
   * @description Private link to selected (used) connection
   */
  private '#current': IRDKafkaHighLevelProducerConnection | undefined;
  /**
   * @description Namespace path for fetching configuration
   */
  protected readonly namespace = 'RDKafkaHighLevelProducer';
  /**
   * @description Create connection
   */
  protected async connect(config: IRDKafkaHighLevelProducerConfig) {
    let connection: IRDKafkaHighLevelProducerConnection;
    try {
      connection = new RDKafkaHighLevelProducerConnection(config.global, config.topic);
      connection.setPollInterval(config.pollInterval ?? 100);
      await connection.connectPromise();
    } catch (e: unknown) {
      throw new RDKafkaHighLevelProducerCantConnectError(<Error>e);
    }
    return connection;
  }
}
