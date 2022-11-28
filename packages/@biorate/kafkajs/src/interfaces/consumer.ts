import { IConnectorConfig, IConnector } from '@biorate/connector';
import { KafkaConfig, Consumer, ConsumerConfig, ConsumerSubscribeTopics } from 'kafkajs';

export type IKafkaJSConsumerConfig = IConnectorConfig & {
  global: KafkaConfig;
  options: ConsumerConfig;
  subscribe?: ConsumerSubscribeTopics;
};

export type IKafkaJSConsumerConnection = Consumer;

export type IKafkaJSConsumerConnector = IConnector<
  IKafkaJSConsumerConfig,
  IKafkaJSConsumerConnection
>;
