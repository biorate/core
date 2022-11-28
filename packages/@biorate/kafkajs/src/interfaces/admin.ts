import { IConnectorConfig, IConnector } from '@biorate/connector';
import { KafkaConfig, Admin, AdminConfig } from 'kafkajs';

export type IKafkaJSAdminConfig = IConnectorConfig & {
  global: KafkaConfig;
  options: AdminConfig;
};

export type IKafkaJSAdminConnection = Admin;

export type IKafkaJSAdminConnector = IConnector<
  IKafkaJSAdminConfig,
  IKafkaJSAdminConnection
>;
