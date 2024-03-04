import { IConnectorConfig, IConnector } from '@biorate/connector';
import {
  AmqpConnectionManagerOptions,
  ConnectionUrl,
  CreateChannelOpts,
} from 'amqp-connection-manager';
import { IAmqpConnectionManager } from 'amqp-connection-manager/dist/types/AmqpConnectionManager';

export type IAmqpConnection = IAmqpConnectionManager;

export interface IAmqpConfig extends IConnectorConfig {
  urls: ConnectionUrl | ConnectionUrl[];
  options?: AmqpConnectionManagerOptions;
}

export type IAmqpConnector = IConnector<IAmqpConfig, IAmqpConnection>;

export type ICreateChannelOpts = CreateChannelOpts & { name: string };
