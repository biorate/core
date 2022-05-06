import { IConnectorConfig, IConnector } from '@biorate/connector';
import { Sequelize, ModelCtor } from 'sequelize-typescript';
import { Options, QueryOptions, QueryTypes, QueryOptionsWithType } from 'sequelize';

export type IModels = string[] | ModelCtor[];

export type ISequelizeConnection = Sequelize;

export interface ISequelizeConfig extends IConnectorConfig {
  host: string;
  options: Options & { models?: IModels };
}

export type ISequelizeConnector = IConnector<ISequelizeConfig, ISequelizeConnection> & {
  query<T = unknown>(
    sql: string | { query: string; values: unknown[] },
    options?: (QueryOptions | QueryOptionsWithType<QueryTypes.RAW>) & {
      connection?: string;
    },
  ): Promise<T[]>;
};
