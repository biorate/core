import { IConnectorConfig, IConnector } from '@biorate/connector';
import {
  AmqpConnectionManagerOptions,
  ConnectionUrl,
  CreateChannelOpts,
} from 'amqp-connection-manager';
import { IAmqpConnectionManager } from 'amqp-connection-manager/dist/types/AmqpConnectionManager';

/** @description Amqp connection type. */
export type IAmqpConnection = IAmqpConnectionManager;

/** @description Amqp connection config. */
export interface IAmqpConfig extends IConnectorConfig {
  urls: ConnectionUrl | ConnectionUrl[];
  options?: AmqpConnectionManagerOptions;
}

/** @description Amqp connector type. */
export type IAmqpConnector = IConnector<IAmqpConfig, IAmqpConnection>;

/** @description Create channel options with a required name field. */
export type ICreateChannelOpts = CreateChannelOpts & { name: string };
