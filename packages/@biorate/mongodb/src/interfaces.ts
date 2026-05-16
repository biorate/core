import { IConnectorConfig, IConnector } from '@biorate/connector';
import { ConnectOptions, Connection } from 'mongoose';

export * from '@typegoose/typegoose/lib/types';

/** @description MongoDB connection type (aliases the `mongoose` Connection type). */
export type IMongoDBConnection = Connection;

/** @description Configuration interface for MongoDB connector. */
export interface IMongoDBConfig extends IConnectorConfig {
  host: string;
  options: ConnectOptions;
}

/** @description MongoDB connector type. */
export type IMongoDBConnector = IConnector<IMongoDBConfig, IMongoDBConnection>;
