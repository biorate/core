import { IConnectorConfig, IConnector } from '@biorate/connector';
import { create } from './api';

/** @description Schema registry API client instance */
export type ISchemaRegistryConnection = ReturnType<typeof create>;

/** @description Configuration interface for schema registry connector */
export interface ISchemaRegistryConfig extends IConnectorConfig {
  baseURL: string;
  headers: Record<string, string>;
}

/** @description Schema registry connector type combining config and connection */
export type ISchemaRegistryConnector = IConnector<
  ISchemaRegistryConfig,
  ISchemaRegistryConnection
>;

/** @description Supported compatibility types for schema registry */
export type ICompatibilities =
  | 'BACKWARD'
  | 'BACKWARD_TRANSITIVE'
  | 'FORWARD'
  | 'FORWARD_TRANSITIVE'
  | 'FULL'
  | 'FULL_TRANSITIVE'
  | 'NONE';
