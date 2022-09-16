import { EventEmitter } from 'events';
import { IConnectorConfig, IConnector } from '@biorate/connector';
import {
  ConsumerGlobalConfig,
  ConsumerTopicConfig,
  ReadStreamOptions,
  Message,
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

export interface IRDKafkaConsumerStreamConnection extends EventEmitter {
  subscribe(handler: (message: Message | Message[]) => Promise<void> | void): void;

  unsubscribe(): void;
}

export type IRDKafkaConsumerStreamConnector = IConnector<
  IRDKafkaConsumerStreamConfig,
  IRDKafkaConsumerStreamConnection
>;
