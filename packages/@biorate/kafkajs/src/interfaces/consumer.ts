import { IConnectorConfig, IConnector } from '@biorate/connector';
import {
  KafkaConfig,
  Consumer,
  ConsumerConfig,
  ConsumerSubscribeTopics,
  ConsumerRunConfig,
} from 'kafkajs';

export type IKafkaJSConsumerConfig = IConnectorConfig & {
  global: KafkaConfig;
  options: ConsumerConfig;
  subscribe?: ConsumerSubscribeTopics;
  runConfig?: ConsumerRunConfig;
  concurrency?: number;
};

export type IKafkaJSConsumerConnection = Consumer;

export type IKafkaJSConsumerConnector = IConnector<
  IKafkaJSConsumerConfig,
  IKafkaJSConsumerConnection
>;
