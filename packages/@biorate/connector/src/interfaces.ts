export interface IConnectorConfig {
  name: string;
}

export interface IConnector<C extends IConnectorConfig, T = any> {
  readonly current: T | undefined;
  readonly connections: Map<string, T>;
  use(name: string): void;
  connection(name?: string): T;
  get(name?: string): T;
}
