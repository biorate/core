import { Connector, IConnector } from '@biorate/connector';
import { IMongoDBConfig, IMongoDBConnection } from './src';

declare module '@biorate/mongodb' {
  export class MongoDBConnector extends Connector<IMongoDBConfig, IMongoDBConnection> {
    protected readonly namespace: string;
    protected connect(config: IMongoDBConfig): Promise<IMongoDBConnection>;
  }

  export function model<T = unknown>(
    Model: new (...args: any) => T,
    connection?: string,
    options?: Record<string, unknown>,
  ): void;
}
