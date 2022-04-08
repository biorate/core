export interface IConnector<C extends { name: string }, T = any> {
  readonly connections: Map<string, T>;
  use(name: string): void;
  connection(name?: string): T;
}
