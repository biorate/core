import { injectable } from '@biorate/inversion';
import { Connector } from '@biorate/connector';
import { Client } from '@opensearch-project/opensearch';
import { IOpenSearchConfig, IOpenSearchConnection } from './interfaces';
import { OpenSearchCantConnectError } from './errors';

export * from './errors';
export * from './interfaces';

/**
 * @description OpenSearch connector
 *
 * ### Features:
 * - connector manager for OpenSearch
 *
 * @example
 * ```
 * import { inject, container, Types, Core } from '@biorate/inversion';
 * import { IConfig, Config } from '@biorate/config';
 * import { OpenSearchConnector, IOpenSearchConnector } from '../../src';
 *
 * export class Root extends Core() {
 *   @inject(Types.Config) public config: IConfig;
 *
 *   @inject(OpenSearchConnector) public opensearchConnector: IOpenSearchConnector;
 * }
 *
 * container.bind<IConfig>(Types.Config).to(Config).inSingletonScope();
 * container.bind<IOpenSearchConnector>(OpenSearchConnector).toSelf().inSingletonScope();
 * container.bind<Root>(Root).toSelf().inSingletonScope();
 *
 * container.get<IConfig>(Types.Config).merge({
 *   OpenSearch: [
 *     {
 *       name: 'dev',
 *       options: {
 *         node: 'https://admin:fo4Gai1phah7eexu@localhost:9200',
 *         ssl: {
 *           rejectUnauthorized: false,
 *         },
 *       },
 *     },
 *   ],
 * });
 *
 * (async () => {
 *   root = container.get<Root>(Root);
 *   await root.$run();
 *
 *   await root.opensearchConnector.current!.indices.create({
 *     index: 'test_index',
 *     body: {
 *       settings: {
 *         index: {
 *           number_of_shards: 1,
 *           number_of_replicas: 1,
 *         },
 *       },
 *     },
 *   });
 * })();
 * ```
 */
@injectable()
export class OpenSearchConnector extends Connector<
  IOpenSearchConfig,
  IOpenSearchConnection
> {
  /**
   * @description Private connections storage
   */
  private '#connections': Map<string, IOpenSearchConnection>;

  /**
   * @description Private link to selected (used) connection
   */
  private '#current': IOpenSearchConnection | undefined;

  /**
   * @description Namespace path for fetching configuration
   */
  protected readonly namespace = 'OpenSearch';

  protected async connect(config: IOpenSearchConfig) {
    let connection: IOpenSearchConnection;
    try {
      connection = new Client(config.options);
      await connection.ping();
    } catch (e: unknown) {
      throw new OpenSearchCantConnectError(<Error>e);
    }
    return connection;
  }
}
