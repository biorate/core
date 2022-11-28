import { IConnectorConfig, IConnector } from '@biorate/connector';
import { KafkaConfig, Producer, ProducerConfig } from 'kafkajs';

export type IKafkaJSProducerConfig = IConnectorConfig & {
  global: KafkaConfig;
  options: ProducerConfig;
  partitioner?: 'LegacyPartitioner' | 'DefaultPartitioner';
};

export type IKafkaJSProducerConnection = Producer;

export type IKafkaJSProducerConnector = IConnector<
  IKafkaJSProducerConfig,
  IKafkaJSProducerConnection
>;
