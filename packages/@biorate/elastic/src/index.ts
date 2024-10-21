import { injectable } from '@biorate/inversion';
import { Connector } from '@biorate/connector';
import { Client } from '@opensearch-project/opensearch';
import { IElasticConfig, IElasticConnection } from './interfaces';
import { ElasticCantConnectError } from './errors';

export * from './errors';
export * from './interfaces';

@injectable()
export class ElasticConnector extends Connector<IElasticConfig, IElasticConnection> {
  /**
   * @description Private connections storage
   */
  private '#connections': Map<string, IElasticConnection>;

  /**
   * @description Private link to selected (used) connection
   */
  private '#current': IElasticConnection | undefined;

  /**
   * @description Namespace path for fetching configuration
   */
  protected readonly namespace = 'Elastic';

  protected async connect(config: IElasticConfig) {
    let connection: IElasticConnection;
    try {
      connection = new Client(config.options);
      await connection.ping();
    } catch (e: unknown) {
      throw new ElasticCantConnectError(<Error>e);
    }
    return connection;
  }
}
