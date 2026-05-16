import { IConnectorConfig, IConnector } from '@biorate/connector';
import { Sequelize, ModelCtor } from 'sequelize-typescript';
import { Options, QueryOptions, QueryTypes, QueryOptionsWithType } from 'sequelize';

/** @description Collection of model names or model constructors */
export type IModels = string[] | ModelCtor[];

/** @description Sequelize ORM connection instance */
export type ISequelizeConnection = Sequelize;

/** @description Configuration interface for Sequelize connector */
export interface ISequelizeConfig extends IConnectorConfig {
  host: string;
  options: Options & { models?: IModels };
}

/** @description Sequelize connector type with custom query method */
export type ISequelizeConnector = IConnector<ISequelizeConfig, ISequelizeConnection> & {
  query<T = unknown>(
    sql: string | { query: string; values: unknown[] },
    options?: (QueryOptions | QueryOptionsWithType<QueryTypes.RAW>) & {
      connection?: string;
    },
  ): Promise<T[]>;
};
