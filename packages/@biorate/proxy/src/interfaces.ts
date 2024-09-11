import { IConnectorConfig, IConnector } from '@biorate/connector';
import {
  ServerOpts,
  ListenOptions,
  TcpSocketConnectOpts,
  SocketConstructorOpts,
} from 'net';
import { ProxyConnection } from './connection';

export type IClientOption = {
  liveness?: string;
  address: TcpSocketConnectOpts;
  options?: SocketConstructorOpts;
};

export type IProxyConnection = ProxyConnection;

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

export type IProxyConnector = IConnector<IProxyConfig, IProxyConnection>;
