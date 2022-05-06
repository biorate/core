import { IConnectorConfig, IConnector } from '@biorate/connector';
import { ConnectOptions, Connection } from 'mongoose';

export type IMongoDBConnection = Connection;

export interface IMongoDBConfig extends IConnectorConfig {
  host: string;
  options: ConnectOptions;
}

export type IMongoDBConnector = IConnector<IMongoDBConfig, IMongoDBConnection>;
