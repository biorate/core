import { IConnectorConfig, IConnector } from '@biorate/connector';
import {
  ServerOpts,
  ListenOptions,
  TcpSocketConnectOpts,
  SocketConstructorOpts,
} from 'net';
import { ProxyConnection } from './connection';

/** @description Proxy client connection options. */
export type IClientOption = {
  liveness?: string;
  address: TcpSocketConnectOpts;
  options?: SocketConstructorOpts;
};

/** @description Proxy connection type alias. */
export type IProxyConnection = ProxyConnection;

/** @description Proxy module configuration interface. */
export interface IProxyConfig extends IConnectorConfig {
  retry?: number;
  timeout?: number;
  checkInterval?: number;
  server: {
    options?: ServerOpts;
    address: ListenOptions;
  };
  clients: IClientOption[];
}

/** @description Proxy connector type alias. */
export type IProxyConnector = IConnector<IProxyConfig, IProxyConnection>;
