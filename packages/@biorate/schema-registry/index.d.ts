import { Connector, IConnector } from '@biorate/connector';
import { ISchemaRegistryConfig, ISchemaRegistryConnection } from './src';

declare module '@biorate/schema-registry' {
  export class SchemaRegistryConnector extends Connector<
    ISchemaRegistryConfig,
    ISchemaRegistryConnection
  > {
    protected readonly namespace: string;
    protected connect(config: ISchemaRegistryConfig): Promise<ISchemaRegistryConnection>;
  }
}
