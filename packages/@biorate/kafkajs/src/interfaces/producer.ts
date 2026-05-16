import { IConnectorConfig, IConnector } from '@biorate/connector';
import { KafkaConfig, Producer, ProducerConfig } from 'kafkajs';

/**
 * @description Configuration for the KafkaJS producer.
 */
export type IKafkaJSProducerConfig = IConnectorConfig & {
  global: KafkaConfig;
  options: ProducerConfig;
  partitioner?: 'LegacyPartitioner' | 'DefaultPartitioner';
};

/**
 * @description Producer connection type (KafkaJS Producer).
 */
export type IKafkaJSProducerConnection = Producer;

/**
 * @description Producer connector type.
 */
export type IKafkaJSProducerConnector = IConnector<
  IKafkaJSProducerConfig,
  IKafkaJSProducerConnection
>;
