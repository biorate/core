import { injectable } from '@biorate/inversion';
import { Connector } from '@biorate/connector';
import { RDKafkaAdminCantConnectError } from '../errors';
import { RDKafkaAdminConnection } from '../connections';
import { IRDKafkaAdminConfig, IRDKafkaAdminConnection } from '../interfaces';
/**
 * @description RDKafka admin connector
 *
 * ### Features:
 * - admin connector manager for node-rdkafka
 *
 * @example
 * ```
 * ```
 */
@injectable()
export class RDKafkaAdminConnector extends Connector<
  IRDKafkaAdminConfig,
  IRDKafkaAdminConnection
> {
  /**
   * @description Private connections storage
   */
  private '#connections': Map<string, IRDKafkaAdminConnection>;
  /**
   * @description Private link to selected (used) connection
   */
  private '#current': IRDKafkaAdminConnection | undefined;
  /**
   * @description Namespace path for fetching configuration
   */
  protected readonly namespace = 'RDKafkaAdmin';
  /**
   * @description Create connection
   */
  protected async connect(config: IRDKafkaAdminConfig) {
    let connection: IRDKafkaAdminConnection;
    try {
      connection = new RDKafkaAdminConnection(config.global);
    } catch (e: unknown) {
      throw new RDKafkaAdminCantConnectError(<Error>e);
    }
    return connection;
  }
}
