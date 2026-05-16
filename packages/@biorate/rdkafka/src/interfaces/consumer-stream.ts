import { EventEmitter } from 'events';
import { IConnectorConfig, IConnector } from '@biorate/connector';
import type {
  ConsumerGlobalConfig,
  ConsumerTopicConfig,
  ReadStreamOptions,
  Message,
  ConsumerStream,
} from '@confluentinc/kafka-javascript';

/**
 * @description Configuration for the RDKafka consumer stream.
 */
export type IRDKafkaConsumerStreamConfig = IConnectorConfig & {
  global: ConsumerGlobalConfig;
  topic: ConsumerTopicConfig;
  stream: ReadStreamOptions;
  buffer?: number;
  concurrency?: number;
  batch?: boolean;
  delay?: number;
};

/**
 * @description Consumer stream connection interface.
 */
export interface IRDKafkaConsumerStreamConnection extends EventEmitter {
  stream: ConsumerStream;
  subscribe(handler: (message: Message | Message[]) => Promise<void> | void): void;
  unsubscribe(): Promise<void>;
}

/**
 * @description Consumer stream connector type.
 */
export type IRDKafkaConsumerStreamConnector = IConnector<
  IRDKafkaConsumerStreamConfig,
  IRDKafkaConsumerStreamConnection
>;
