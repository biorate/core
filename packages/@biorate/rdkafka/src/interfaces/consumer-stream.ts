import { EventEmitter } from 'events';
import { IConnectorConfig, IConnector } from '@biorate/connector';
import {
  ConsumerGlobalConfig,
  ConsumerTopicConfig,
  ReadStreamOptions,
} from 'node-rdkafka';

export type IRDKafkaConsumerStreamConfig = IConnectorConfig & {
  type: 'ConsumerStream';
  global: ConsumerGlobalConfig;
  topic: ConsumerTopicConfig;
  stream: ReadStreamOptions;
  buffer?: number;
  concurrency?: number;
  batch?: boolean;
};

export interface IRDKafkaConsumerStreamConnection extends EventEmitter {}

export type IRDKafkaConsumerStreamConnector = IConnector<
  IRDKafkaConsumerStreamConfig,
  IRDKafkaConsumerStreamConnection
>;
