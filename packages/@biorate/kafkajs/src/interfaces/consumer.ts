import { IConnectorConfig, IConnector } from '@biorate/connector';
import {
  KafkaConfig,
  Consumer,
  ConsumerConfig,
  ConsumerSubscribeTopics,
  ConsumerRunConfig,
} from 'kafkajs';

/**
 * @description Configuration for the KafkaJS consumer.
 */
export type IKafkaJSConsumerConfig = IConnectorConfig & {
  global: KafkaConfig;
  options: ConsumerConfig;
  subscribe?: ConsumerSubscribeTopics;
  runConfig?: ConsumerRunConfig;
  concurrency?: number;
};

/**
 * @description Consumer connection type (KafkaJS Consumer).
 */
export type IKafkaJSConsumerConnection = Consumer;

/**
 * @description Consumer connector type.
 */
export type IKafkaJSConsumerConnector = IConnector<
  IKafkaJSConsumerConfig,
  IKafkaJSConsumerConnection
>;
