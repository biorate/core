import { IConnectorConfig, IConnector } from '@biorate/connector';
import { create } from './api';

export type ISchemaRegistryConnection = ReturnType<typeof create>;

export interface ISchemaRegistryConfig extends IConnectorConfig {
  baseURL: string;
  headers: Record<string, string>;
}

export type ISchemaRegistryConnector = IConnector<
  ISchemaRegistryConfig,
  ISchemaRegistryConnection
>;

export type ICompatibilities = 'BACKWARD' | 'FORWARD' | 'FULL' | 'TRANSITIVE';
