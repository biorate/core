import { IConnectorConfig, IConnector } from '@biorate/connector';

export type IHaproxyConnection = {
  start(): Promise<boolean>;
  stop(all?: boolean): Promise<boolean>;
  softstop(): Promise<boolean>;
  reload(hard?: boolean): Promise<boolean>;
  verify(): Promise<boolean>;
  running(): Promise<boolean>;
  /* TODO:
   clear(all?: boolean): Promise<void>;
   disable(backend: string, server: string): Promise<void>;
   enable(backend: string, server: string): Promise<void>;
   pause(): Promise<void>;
   resume(frontend: string): Promise<void>;
   errors(id?: string | number): Promise<void>;
   weight(backend: string, server: string, weight?: number): Promise<void>;
   maxconn(frontend: string, max: number): Promise<void>;
   maxconn(max: number): Promise<void>;
   ratelimit(value: number): Promise<void>;
   compression(value: number): Promise<void>;
   info(): Promise<string>;
   session(id?: string | number): Promise<void>;
   stat(...args: string[]): Promise<string>;
   */
};

export interface IHaproxyConfig extends IConnectorConfig {
  config: {
    [key: string]: {
      [key: string]: string | number;
    };
  };
  debug?: boolean;
}

export type IHaproxyConnector = IConnector<IHaproxyConfig, IHaproxyConnection>;
