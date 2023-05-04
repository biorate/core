import { IConnectorConfig, IConnector } from '@biorate/connector';
import {
  Producer,
  ProducerTopicConfig,
  TopicPartitionOffset,
  KafkaConsumer,
  MetadataOptions,
  ProducerGlobalConfig,
} from 'node-rdkafka';

export type IRDKafkaProducerConfig = IConnectorConfig & {
  global: ProducerGlobalConfig;
  topic?: ProducerTopicConfig;
  pollInterval?: number;
};

// noinspection JSAnnotator
export interface IRDKafkaProducerConnection extends Producer {
  connectPromise(metadataOptions?: MetadataOptions): Promise<this>;
  initTransactionsPromise(timeout?: number): Promise<void>;
  beginTransactionPromise(): Promise<void>;
  commitTransactionPromise(timeout?: number): Promise<void>;
  abortTransactionPromise(timeout?: number): Promise<void>;
  sendOffsetsToTransactionPromise(
    offsets: TopicPartitionOffset[],
    consumer: KafkaConsumer,
    timeout?: number,
  ): Promise<void>;
}

export type IRDKafkaProducerConnector = IConnector<
  IRDKafkaProducerConfig,
  IRDKafkaProducerConnection
>;
