import { injectable } from '@biorate/inversion';
import { Connector } from '@biorate/connector';
import { connect } from 'mssql';
import { MssqlCantConnectError } from './errors';
import { IMssqlConfig, IMssqlConnection } from './interfaces';

export * from './errors';
export * from './interfaces';

/**
 * @description Mssql raw connector
 *
 * ### Features:
 * - connector manager for mssql
 *
 * @example
 * ```
 * import { inject, container, Types, Core } from '@biorate/inversion';
 * import { IConfig, Config } from '@biorate/config';
 * import { MssqlConnector, IMssqlConnector } from '@biorate/mssql';
 *
 * class Root extends Core() {
 *   @inject(MssqlConnector) public connector: IMssqlConnector;
 * }
 *
 * container.bind<IConfig>(Types.Config).to(Config).inSingletonScope();
 * container.bind<IMssqlConnector>(MssqlConnector).toSelf().inSingletonScope();
 * container.bind<Root>(Root).toSelf().inSingletonScope();
 *
 * container.get<IConfig>(Types.Config).merge({
 *   Mssql: [
 *     {
 *       name: 'connection',
 *       options: {
 *         server: 'localhost',
 *         user: 'sa',
 *         password: 'admin_007',
 *         database: 'master',
 *         options: {
 *           trustServerCertificate: true,
 *         },
 *       },
 *     },
 *   ],
 * });
 *
 * (async () => {
 *   const root = container.get<Root>(Root);
 *   await root.$run();
 *   await root.connector!.current?.query(
 *     `CREATE TABLE test (
 *          count int,
 *          text varchar(20)
 *       );`,
 *   );
 *   await root.connector!.current?.query(
 *     `INSERT INTO test (count, text) VALUES (1, 'test1'), (2, 'test2'), (3, 'test3');`,
 *   );
 *   console.log(await root.connector!.current?.query(`SELECT * FROM test;`));
 *   // {
 *   //   recordsets: [ [ [Object], [Object], [Object] ] ],
 *   //   recordset: [
 *   //     { count: 1, text: 'test1' },
 *   //     { count: 2, text: 'test2' },
 *   //     { count: 3, text: 'test3' }
 *   //   ],
 *   //  output: {},
 *   //   rowsAffected: [ 3 ]
 *   //  }
 * })();
 * ```
 */
@injectable()
export class MssqlConnector extends Connector<IMssqlConfig, IMssqlConnection> {
  /**
   * @description Namespace path for fetching configuration
   */
  protected readonly namespace = 'Mssql';
  /**
   * @description Create connection
   */
  protected async connect(config: IMssqlConfig) {
    let connection: IMssqlConnection;
    try {
      connection = await connect(config.options);
    } catch (e: unknown) {
      throw new MssqlCantConnectError(<Error>e);
    }
    return connection;
  }
}
