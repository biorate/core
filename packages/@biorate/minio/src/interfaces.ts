import { IConnectorConfig, IConnector } from '@biorate/connector';
import { Client, ClientOptions } from 'minio';

export type MinioConnection = Client;

export interface MinioConfig extends IConnectorConfig {
  host: string;
  options: ClientOptions;
}

export type IMongoDBConnector = IConnector<MinioConfig, MinioConnection>;
