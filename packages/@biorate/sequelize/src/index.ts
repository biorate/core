import { injectable } from '@biorate/inversion';
import { Connector } from '@biorate/connector';
import { Sequelize } from 'sequelize-typescript';
import { QueryTypes, QueryOptions, QueryOptionsWithType } from 'sequelize';
import { omit } from 'lodash';
import { SequelizeCantConnectError, UndefinedConnectionError } from './errors';
import { ISequelizeConfig, ISequelizeConnection, IModels } from './interfaces';

export * from './errors';
export * from './interfaces';
export * from 'sequelize-typescript';

/**
 * @description Sequelize ORM connector
 *
 * ### Features:
 * - connector manager for sequelize
 *
 * @example
 * ```
 * import { join } from 'path';
 * import { tmpdir } from 'os';
 * import { container, Core, inject, Types } from '@biorate/inversion';
 * import { Config, IConfig } from '@biorate/config';
 * import { ISequelizeConnector, SequelizeConnector as BaseSequelizeConnector } from '@biorate/sequelize';
 * import { Table, Column, Model, DataType } from '@biorate/sequelize';
 *
 * const connectionName = 'db';
 *
 * // Create model
 * @Table({
 *   tableName: 'test',
 *   timestamps: false,
 * })
 * export class TestModel extends Model {
 *   @Column({ type: DataType.CHAR, primaryKey: true })
 *   key: string;
 *
 *   @Column(DataType.INTEGER)
 *   value: number;
 * }
 *
 * // Assign models with sequelize connector
 * class SequelizeConnector extends BaseSequelizeConnector {
 *   protected readonly models = { [connectionName]: [TestModel] };
 * }
 *
 * // Create Root class
 * export class Root extends Core() {
 *   @inject(SequelizeConnector) public connector: ISequelizeConnector;
 * }
 *
 * // Bind dependencies
 * container.bind<IConfig>(Types.Config).to(Config).inSingletonScope();
 * container.bind<ISequelizeConnector>(SequelizeConnector).toSelf().inSingletonScope();
 * container.bind<Root>(Root).toSelf().inSingletonScope();
 *
 * // Merge config
 * container.get<IConfig>(Types.Config).merge({
 *   Sequelize: [
 *     {
 *       name: connectionName,
 *       options: {
 *         logging: false,
 *         dialect: 'sqlite',
 *         storage: join(tmpdir(), 'sqlite-test.db'),
 *       },
 *     },
 *   ],
 * });
 *
 * // Example
 * (async () => {
 *   await container.get<Root>(Root).$run();
 *   // Drop table if exists
 *   await TestModel.drop();
 *   // Create table
 *   await TestModel.sync();
 *   // Create model item
 *   await TestModel.create({ key: 'test', value: 1 });
 *   // Create find model item by key
 *   const data = await TestModel.findOne({ where: { key: 'test' } });
 *   console.log(data.toJSON()); // { key: 'test', value: 1 }
 * })();
 * ```
 */
@injectable()
export class SequelizeConnector extends Connector<
  ISequelizeConfig,
  ISequelizeConnection
> {
  /**
   * @description Private connections storage
   */
  private '#connections': Map<string, ISequelizeConnection>;
  /**
   * @description Private link to selected (used) connection
   */
  private '#current': ISequelizeConnection | undefined;
  /**
   * @description Namespace path for fetching configuration
   */
  protected readonly namespace = 'Sequelize';
  /**
   * @description Models list, key - connection name, value - array of models
   */
  protected readonly models: { [key: string]: IModels } = {};
  /**
   * @description Create connection
   */
  protected async connect(config: ISequelizeConfig) {
    let connection: ISequelizeConnection;
    try {
      config.options.models = this.models[config.name] ?? [];
      connection = new Sequelize(config.options);
      await connection.authenticate();
    } catch (e: unknown) {
      throw new SequelizeCantConnectError(<Error>e);
    }
    return connection;
  }
  /**
   * @description Execute query on current connection
   */
  public async query<T = unknown>(
    sql: string | { query: string; values: unknown[] },
    options: (QueryOptions | QueryOptionsWithType<QueryTypes.RAW>) & {
      connection?: string;
    } = {},
  ): Promise<T[]> {
    const name = options?.connection;
    omit(options, 'connection');
    const connection = this.connection(name);
    if (!connection) throw new UndefinedConnectionError(name);
    const result = await connection.query(sql, options);
    return result[0] as T[];
  }
}
