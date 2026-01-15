import { EventEmitter } from 'events';
import { IConnectorConfig, IConnector } from '@biorate/connector';
import {
  ConsumerGlobalConfig,
  ConsumerTopicConfig,
  ReadStreamOptions,
  Message,
  ConsumerStream,
} from '@confluentinc/kafka-javascript';

export type IRDKafkaConsumerStreamConfig = IConnectorConfig & {
  global: ConsumerGlobalConfig;
  topic: ConsumerTopicConfig;
  stream: ReadStreamOptions;
  buffer?: number;
  concurrency?: number;
  batch?: boolean;
  delay?: number;
};

export interface IRDKafkaConsumerStreamConnection extends EventEmitter {
  stream: ConsumerStream;

  subscribe(handler: (message: Message | Message[]) => Promise<void> | void): void;

  unsubscribe(): Promise<void>;
}

export type IRDKafkaConsumerStreamConnector = IConnector<
  IRDKafkaConsumerStreamConfig,
  IRDKafkaConsumerStreamConnection
>;
