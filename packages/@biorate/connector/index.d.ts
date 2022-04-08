import { IConnector } from './src';

declare module '@biorate/connector' {
  export class Connector<C extends { name: string }, T = any>
    implements IConnector<C, T>
  {
    public readonly connections: Map<string, T>;
    public current: T;
    public use(name: string): void;
    public connection(name?: string): T;
  }
}
