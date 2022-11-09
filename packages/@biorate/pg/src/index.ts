import { injectable } from '@biorate/inversion';
import { Connector } from '@biorate/connector';
import { Client } from 'pg';
import * as Cursor from 'pg-cursor';
// @ts-ignore pg-query-stream module type bug
import * as QueryStream from 'pg-query-stream';
import { PgCantConnectError } from './errors';
import { IPgConfig, IPgConnection } from './interfaces';

export * from './errors';
export * from './interfaces';
/**
 * @description PostgreSQL raw connector
 *
 * ### Features:
 * - connector manager for PostgreSQL
 *
 * @example
 * ```
 * import { inject, container, Types, Core } from '@biorate/inversion';
 * import { IConfig, Config } from '@biorate/config';
 * import { PgConnector, IPgConnector } from '@biorate/pg';
 *
 * class Root extends Core() {
 *   @inject(PgConnector) public connector: IPgConnector;
 * }
 *
 * container.bind<IConfig>(Types.Config).to(Config).inSingletonScope();
 * container.bind<IPgConnector>(PgConnector).toSelf().inSingletonScope();
 * container.bind<Root>(Root).toSelf().inSingletonScope();
 *
 * container.get<IConfig>(Types.Config).merge({
 *   Pg: [
 *     {
 *       name: 'connection',
 *       options: {
 *         user: 'postgres',
 *         host: 'localhost',
 *         database: 'postgres',
 *         password: 'postgres',
 *         port: 5432,
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
 *   console.log((await root.connector!.current?.query(`SELECT * FROM test;`))!.rows);
 *   // [
 *   //   {
 *   //     "count": 1,
 *   //     "text": "test1",
 *   //   },
 *   //   {
 *   //     "count": 2,
 *   //     "text": "test2",
 *   //   },
 *   //   {
 *   //     "count": 3,
 *   //     "text": "test3",
 *   //   },
 *   // ]
 * })();
 * ```
 */
@injectable()
export class PgConnector extends Connector<IPgConfig, IPgConnection> {
  /**
   * @description Namespace path for fetching configuration
   */
  protected readonly namespace = 'Pg';
  /**
   * @description Create connection
   */
  protected async connect(config: IPgConfig) {
    let connection: IPgConnection;
    try {
      connection = new Client(config.options);
      await connection.connect();
    } catch (e: unknown) {
      throw new PgCantConnectError(<Error>e);
    }
    return connection;
  }
  /**
   * @description Create cursor
   */
  public cursor(
    name: string,
    query: string,
    values?: any[],
    config?: Cursor.CursorQueryConfig,
  ) {
    return this.get(name).query(new Cursor(query, values, config));
  }
  /**
   * @description Create stream
   */
  public stream(
    name: string,
    query: string,
    values?: any[],
    config?: Cursor.CursorQueryConfig,
  ) {
    return this.get(name).query(new QueryStream(query, values, config));
  }
}
