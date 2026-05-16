import { IConnectorConfig, IConnector } from '@biorate/connector';
import { Client, ClientOptions } from 'minio';

/** @description Minio connection type (aliases the `minio` Client class). */
export type IMinioConnection = Client;

/** @description Configuration interface for Minio connector. */
export interface IMinioConfig extends IConnectorConfig {
  host: string;
  options: ClientOptions;
}

/** @description Minio connector type. */
export type IMinioConnector = IConnector<IMinioConfig, IMinioConnection>;
