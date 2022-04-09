import { init, inject, injectable, Types } from '@biorate/inversion';
import { IConfig } from '@biorate/config';
import { ISchemaRegistryConfig, ISchemaRegistryConnection } from './interfaces';
import { Connector } from '@biorate/connector';
// import { ConnectorConnectionNotExistsError } from './errors';
import { create } from './api';
export * from './api';
export * from './errors';
export * from './interfaces';

/**
 * @description Schema registry connector
 *
 * ### Features:
 * - connector manager for schema registry
 *
 * @example
 * ```
 * ```
 */
@injectable()
export class SchemaRegistryConnector extends Connector<
  ISchemaRegistryConfig,
  ISchemaRegistryConnection
> {
  protected readonly namespace = 'SchemaRegistry';
  protected async connect(config) {
    return create(config);
  }
}
