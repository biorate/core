import { injectable } from '@biorate/inversion';
import { Connector } from '@biorate/connector';
import { RDKafkaProducerStreamCantConnectError } from '../errors';
import { RDKafkaProducerStreamConnection } from '../connections';
import {
  IRDKafkaProducerStreamConfig,
  IRDKafkaProducerStreamConnection,
} from '../interfaces';
/**
 * @description RDKafka producer stream connector
 *
 * ### Features:
 * - Producer stream connector manager for node-rdkafka
 *
 * @example
 * ```
 * ```
 */
@injectable()
export class RDKafkaProducerStreamConnector extends Connector<
  IRDKafkaProducerStreamConfig,
  IRDKafkaProducerStreamConnection
> {
  /**
   * @description Namespace path for fetching configuration
   */
  protected readonly namespace = 'RDKafkaProducerStream';
  /**
   * @description Create connection
   */
  protected async connect(config: IRDKafkaProducerStreamConfig) {
    let connection: IRDKafkaProducerStreamConnection;
    try {
      connection = new RDKafkaProducerStreamConnection(config);
    } catch (e: unknown) {
      throw new RDKafkaProducerStreamCantConnectError(<Error>e);
    }
    return connection;
  }
}
