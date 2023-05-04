import { injectable } from '@biorate/inversion';
import { Connector } from '@biorate/connector';
import { RDKafkaConsumerStreamCantConnectError } from '../errors';
import { RDKafkaConsumerStreamConnection } from '../connections';
import {
  IRDKafkaConsumerStreamConfig,
  IRDKafkaConsumerStreamConnection,
} from '../interfaces';
/**
 * @description RDKafka consumer stream connector
 *
 * ### Features:
 * - Consumer stream connector manager for node-rdkafka
 *
 * @example
 * ```
 * ```
 */
@injectable()
export class RDKafkaConsumerStreamConnector extends Connector<
  IRDKafkaConsumerStreamConfig,
  IRDKafkaConsumerStreamConnection
> {
  /**
   * @description Private connections storage
   */
  private '#connections': Map<string, IRDKafkaConsumerStreamConnection>;
  /**
   * @description Private link to selected (used) connection
   */
  private '#current': IRDKafkaConsumerStreamConnection | undefined;
  /**
   * @description Namespace path for fetching configuration
   */
  protected readonly namespace = 'RDKafkaConsumerStream';
  /**
   * @description Create connection
   */
  protected async connect(config: IRDKafkaConsumerStreamConfig) {
    let connection: IRDKafkaConsumerStreamConnection;
    try {
      connection = new RDKafkaConsumerStreamConnection(config);
    } catch (e: unknown) {
      throw new RDKafkaConsumerStreamCantConnectError(<Error>e);
    }
    return connection;
  }
}
