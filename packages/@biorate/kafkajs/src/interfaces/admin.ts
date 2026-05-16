import { IConnectorConfig, IConnector } from '@biorate/connector';
import { KafkaConfig, Admin, AdminConfig } from 'kafkajs';

/**
 * @description Configuration for the KafkaJS admin client.
 */
export type IKafkaJSAdminConfig = IConnectorConfig & {
  global: KafkaConfig;
  options: AdminConfig;
};

/**
 * @description Admin connection type (KafkaJS Admin).
 */
export type IKafkaJSAdminConnection = Admin;

/**
 * @description Admin connector type.
 */
export type IKafkaJSAdminConnector = IConnector<
  IKafkaJSAdminConfig,
  IKafkaJSAdminConnection
>;
