import { injectable } from '@biorate/inversion';
import { Connector } from '@biorate/connector';
import { createClient, ClickHouseClient } from '@clickhouse/client';
import { ClickhouseCantConnectError } from './errors';
import { IClickhouseConfig, IClickhouseConnection } from './interfaces';

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
 *   const cursor = await root.connector
 *       .get()
 *       .query({ query: 'SELECT 1 AS result;', format: 'JSON' });
 *   const { data } = await cursor.json<{ result: number }>();
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
    let connection: ClickHouseClient;
    try {
      connection = createClient(config.options);
      await connection.query({ query: 'SELECT 1' });
    } catch (e: unknown) {
      throw new ClickhouseCantConnectError(<Error>e);
    }
    return connection;
  }
}
