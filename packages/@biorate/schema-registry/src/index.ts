import { injectable } from '@biorate/inversion';
import { ISchemaRegistryConfig, ISchemaRegistryConnection } from './interfaces';
import { Connector } from '@biorate/connector';
import { SchemaRegistryCantConnectError } from './errors';
import { create } from './api';
export * from './api';
export * from './errors';
export * from './interfaces';

/**
 * @description Schema registry connector
 *
 * ### Features:
 * - connector manager for schema registry
 *
 * @example
 * ```
 * import { inject, container, Types, Core } from '@biorate/inversion';
 * import { IConfig, Config } from '@biorate/config';
 * import { IConnector } from '@biorate/connector';
 * import { SchemaRegistryConnector, ISchemaRegistryConnector } from '@biorate/schema-registry';
 *
 * export class Root extends Core() {
 *   @inject(SchemaRegistryConnector) public connector: ISchemaRegistryConnector;
 * }
 *
 * container.bind<IConfig>(Types.Config).to(Config).inSingletonScope();
 * container
 *   .bind<ISchemaRegistryConnector>(SchemaRegistryConnector)
 *   .toSelf()
 *   .inSingletonScope();
 * container.bind<Root>(Root).toSelf().inSingletonScope();
 *
 * container.get<IConfig>(Types.Config).merge({
 *   SchemaRegistry: [{ name: 'connection', baseURL: 'http://localhost:8085' }],
 * });
 *
 * (async () => {
 *   const root = container.get<Root>(Root);
 *   await root.$run();
 *
 *   const { PostSubjectsVersions } = root.connector.connection('connection');
 *   const { data } = await PostSubjectsVersions.fetch({
 *     subject: 'test',
 *     schema: {
 *       type: 'record',
 *       name: 'Test',
 *       namespace: 'test',
 *       fields: [
 *         {
 *           name: 'firstName',
 *           type: 'string',
 *         },
 *         {
 *           name: 'lastName',
 *           type: 'string',
 *         },
 *         {
 *           name: 'age',
 *           type: 'int',
 *         },
 *       ],
 *     },
 *   });
 *   console.log(data); // { id: 1 }
 * })();
 * ```
 */
@injectable()
export class SchemaRegistryConnector extends Connector<
  ISchemaRegistryConfig,
  ISchemaRegistryConnection
> {
  /**
   * @description Private connections storage
   */
  private '#connections': Map<string, ISchemaRegistryConnection>;
  /**
   * @description Private link to selected (used) connection
   */
  private '#current': ISchemaRegistryConnection | undefined;
  /**
   * @description Namespace path for fetching configuration
   */
  protected readonly namespace = 'SchemaRegistry';
  /**
   * @description Create connection
   */
  protected async connect(config: ISchemaRegistryConfig) {
    const connection = create(config);
    try {
      await connection.ping();
    } catch (e: unknown) {
      throw new SchemaRegistryCantConnectError(<Error>e);
    }
    return connection;
  }
}
