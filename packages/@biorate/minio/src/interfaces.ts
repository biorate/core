import { IConnectorConfig, IConnector } from '@biorate/connector';
import { Client, ClientOptions } from 'minio';

export type IMinioConnection = Client;

export interface IMinioConfig extends IConnectorConfig {
  host: string;
  options: ClientOptions;
}

export type IMongoDBConnector = IConnector<IMinioConfig, IMinioConnection>;
