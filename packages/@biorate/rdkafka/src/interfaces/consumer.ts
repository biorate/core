import { IConnectorConfig, IConnector } from '@biorate/connector';
import type {
  ConsumerGlobalConfig,
  ConsumerTopicConfig,
  KafkaConsumer,
  TopicPartitionOffset,
  MetadataOptions,
  TopicPartitionTime,
  TopicPartition,
  Message,
} from '@confluentinc/kafka-javascript';

/**
 * @description Configuration for the RDKafka consumer.
 */
export type IRDKafkaConsumerConfig = IConnectorConfig & {
  global: ConsumerGlobalConfig;
  topic: ConsumerTopicConfig;
};

/**
 * @description Consumer connection interface with promisified methods.
 */
export interface IRDKafkaConsumerConnection extends KafkaConsumer {
  consumePromise(number: number): Promise<Message[]>;
  connectPromise(metadataOptions?: MetadataOptions): Promise<this>;
  committedPromise(timeout: number, toppars?: TopicPartition[]): Promise<this>;
  seekPromise(toppar: TopicPartitionOffset, timeout: number | null): Promise<this>;
  offsetsForTimesPromise(
    topicPartitions: TopicPartitionTime[],
    timeout?: number,
  ): Promise<void>;
}

/**
 * @description Consumer connector type.
 */
export type IRDKafkaConsumerConnector = IConnector<
  IRDKafkaConsumerConfig,
  IRDKafkaConsumerConnection
>;
