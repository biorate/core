import { IConnectorConfig, IConnector } from '@biorate/connector';
// Keep public types portable (avoid leaking AxiosPrometheus/Axios types into .d.ts).
export type ISchemaRegistryConnection = {
  ping(): Promise<unknown>;
  putConfig(data: { subject: string; compatibility: ICompatibilities }): Promise<{ data: unknown } | unknown>;
  postSubjects(data: {
    subject: string;
    schema: string | Record<string, any>;
    schemaType?: string;
    reference?: string;
    normalize?: boolean;
  }): Promise<{ data: unknown } | unknown>;
  postSubjectsVersions(data: {
    subject: string;
    schema: string | Record<string, any>;
    schemaType?: string;
    reference?: string;
    normalize?: boolean;
  }): Promise<{ data: unknown } | unknown>;
  encode(subject: string, data: Record<string, any>, version?: string | number): Promise<Buffer>;
  decode(buffer: Buffer): Promise<unknown>;
};

export interface ISchemaRegistryConfig extends IConnectorConfig {
  baseURL: string;
  headers: Record<string, string>;
}

export type ISchemaRegistryConnector = IConnector<
  ISchemaRegistryConfig,
  ISchemaRegistryConnection
>;

export type ICompatibilities =
  | 'BACKWARD'
  | 'BACKWARD_TRANSITIVE'
  | 'FORWARD'
  | 'FORWARD_TRANSITIVE'
  | 'FULL'
  | 'FULL_TRANSITIVE'
  | 'NONE';
