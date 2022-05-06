import { Connector, IConnector } from '@biorate/connector';
import { IModels, ISequelizeConfig, ISequelizeConnection } from './src';
import { QueryOptions, QueryOptionsWithType, QueryTypes } from 'sequelize';

declare module '@biorate/sequelize' {
  export class SequelizeConnector extends Connector<
    ISequelizeConfig,
    ISequelizeConnection
  > {
    protected readonly namespace: string;

    protected readonly models: { [key: string]: IModels };

    protected connect(config: ISequelizeConfig): Promise<ISequelizeConnection>;

    public query<T = unknown>(
      sql: string | { query: string; values: unknown[] },
      options?: (QueryOptions | QueryOptionsWithType<QueryTypes.RAW>) & {
        connection?: string;
      },
    ): Promise<T[]>;
  }
}
