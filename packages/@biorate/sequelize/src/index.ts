import { injectable } from '@biorate/inversion';
import { Connector } from '@biorate/connector';
import { Sequelize } from 'sequelize-typescript';
import { QueryTypes, QueryOptions, QueryOptionsWithType } from 'sequelize';
import { omit } from 'lodash';
import { SequelizeCantConnectError } from './errors';
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
 * import { inject, container, Types, Core } from '@biorate/inversion';
 * import { IConfig, Config } from '@biorate/config';
 * ```
 */
@injectable()
export class SequelizeConnector extends Connector<
  ISequelizeConfig,
  ISequelizeConnection
> {
  /**
   * @description Namespace path for fetching configuration
   */
  protected readonly namespace = 'Sequelize';
  /**
   * @description Models list, key - connection name, value - array of models
   */
  protected models: { [key: string]: IModels } = {};
  /**
   * @description Create connection
   */
  protected async connect(config: ISequelizeConfig) {
    let connection: ISequelizeConnection;
    try {
      config.options.models = this.models[config.name] ?? [];
      connection = new Sequelize(config.options);
      connection.authenticate();
    } catch (e) {
      throw new SequelizeCantConnectError(e);
    }
    return connection;
  }
  /**
   * @description Execute query on current connection
   */
  public async query<T = unknown>(
    sql: string | { query: string; values: unknown[] },
    options?: (QueryOptions | QueryOptionsWithType<QueryTypes.RAW>) & {
      connection?: string;
    },
  ): Promise<T[]> {
    const name = options?.connection;
    omit(options, 'connection');
    const connection = this.connection(name);
    const result = await connection.query(sql, options);
    return result[0] as T[];
  }
}
