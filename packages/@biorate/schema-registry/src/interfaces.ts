import { IConnectorConfig, IConnector } from '@biorate/connector';
import { create } from './api';

export type ISchemaRegistryConnection = ReturnType<typeof create>;

export interface ISchemaRegistryConfig extends IConnectorConfig {
  baseURL: string;
}

export type ISchemaRegistryConnector = IConnector<
  ISchemaRegistryConfig,
  ISchemaRegistryConnection
>;
