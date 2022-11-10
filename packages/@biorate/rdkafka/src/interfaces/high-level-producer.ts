import { IConnectorConfig, IConnector } from '@biorate/connector';
import {
  HighLevelProducer,
  ProducerGlobalConfig,
  ProducerTopicConfig,
  TopicPartitionOffset,
  KafkaConsumer,
  MetadataOptions,
  NumberNullUndefined,
  MessageHeader,
} from 'node-rdkafka';

export type IRDKafkaHighLevelProducerConfig = IConnectorConfig & {
  global: ProducerGlobalConfig;
  topic?: ProducerTopicConfig;
  pollInterval?: number;
};

export interface IRDKafkaHighLevelProducerConnection extends HighLevelProducer {
  producePromise(
    topic: string,
    partition: NumberNullUndefined,
    message: any,
    key: any,
    timestamp: NumberNullUndefined,
    headers?: MessageHeader[],
  ): Promise<NumberNullUndefined>;
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

export type IRDKafkaHighLevelProducerConnector = IConnector<
  IRDKafkaHighLevelProducerConfig,
  IRDKafkaHighLevelProducerConnection
>;
