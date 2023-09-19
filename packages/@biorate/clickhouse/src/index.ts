import { omit } from 'lodash';
import { injectable } from '@biorate/inversion';
import { Connector } from '@biorate/connector';
import { ClickHouse } from 'clickhouse';
import { ClickhouseCantConnectError } from './errors';
import {
  IClickhouseConfig,
  IClickhouseConnection,
  IQueryParams,
  IInsertParams,
} from './interfaces';

export * from './errors';
export * from './interfaces';

/**
 * @description Clickhouse connector
 *
 * ### Features:
 * - connector manager for Clickhouse
 *
 * @example
 * ```
 * import { inject, container, Types, Core } from '@biorate/inversion';
 * import { IConfig, Config } from '@biorate/config';
 * import { ClickhouseConnector, ClickhouseConfig } from '@biorate/clickhouse';
 *
 * class Root extends Core() {
 *   @inject(ClickhouseConnector) public connector: ClickhouseConnector;
 * }
 *
 * container.bind<IConfig>(Types.Config).to(Config).inSingletonScope();
 * container.bind<ClickhouseConnector>(ClickhouseConnector).toSelf().inSingletonScope();
 * container.bind<Root>(Root).toSelf().inSingletonScope();
 *
 * container.get<IConfig>(Types.Config).merge({
 *   Clickhouse: [
 *     {
 *       name: 'connection',
 *       options: {
 *       },
 *     },
 *   ],
 * });
 *
 * (async () => {
 *   const root = container.get<Root>(Root);
 *   await root.$run();
 *
 *   const data = await root.connector!.query<{ result: number }>('SELECT 1 AS result;');
 *   console.log(data); // [{ result: 1 }]
 * })();
 * ```
 */
@injectable()
export class ClickhouseConnector extends Connector<
  IClickhouseConfig,
  IClickhouseConnection
> {
  /**
   * @description Private connections storage
   */
  private '#connections': Map<string, IClickhouseConnection>;
  /**
   * @description Private link to selected (used) connection
   */
  private '#current': IClickhouseConnection | undefined;
  /**
   * @description Namespace path for fetching configuration
   */
  protected readonly namespace = 'Clickhouse';
  /**
   * @description Create connection
   */
  protected async connect(config: IClickhouseConfig) {
    let connection: ClickHouse;
    try {
      connection = new ClickHouse(config.options);
      await connection.query('SELECT 1').toPromise();
    } catch (e: unknown) {
      throw new ClickhouseCantConnectError(<Error>e);
    }
    return connection;
  }
  /**
   * @description Make a query
   */
  public query<T = unknown>(query: string, params: IQueryParams = {}) {
    return this.get(params.connection)
      .query(query, omit(params, 'connection'))
      .toPromise() as unknown as Promise<T[]>;
  }
  /**
   * @description Make a insert
   */
  public insert(query: string, params: IInsertParams = {}) {
    return this.get(params.connection).insert(query, params.rows).toPromise();
  }
}
