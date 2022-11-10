import { IConnectorConfig, IConnector } from '@biorate/connector';
import {
  ProducerGlobalConfig,
  ProducerTopicConfig,
  WriteStreamOptions,
} from 'node-rdkafka';

export type IRDKafkaProducerStreamConfig = IConnectorConfig & {
  global: ProducerGlobalConfig;
  topic: ProducerTopicConfig;
  stream: WriteStreamOptions;
};

export interface IRDKafkaProducerStreamConnection {}

export type IRDKafkaProducerStreamConnector = IConnector<
  IRDKafkaProducerStreamConfig,
  IRDKafkaProducerStreamConnection
>;
