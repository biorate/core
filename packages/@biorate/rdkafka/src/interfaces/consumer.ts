import { IConnectorConfig, IConnector } from '@biorate/connector';
import {
  ConsumerGlobalConfig,
  ConsumerTopicConfig,
  KafkaConsumer,
  TopicPartitionOffset,
  MetadataOptions,
  TopicPartitionTime,
  TopicPartition,
  Message,
} from 'node-rdkafka';

export type IRDKafkaConsumerConfig = IConnectorConfig & {
  type: 'Consumer';
  global: ConsumerGlobalConfig;
  topic: ConsumerTopicConfig;
};

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

export type IRDKafkaConsumerConnector = IConnector<
  IRDKafkaConsumerConfig,
  IRDKafkaConsumerConnection
>;
