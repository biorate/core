import { IConnectorConfig, IConnector } from '@biorate/connector';
import type {
  Producer,
  ProducerTopicConfig,
  TopicPartitionOffset,
  KafkaConsumer,
  MetadataOptions,
  ProducerGlobalConfig,
} from '@confluentinc/kafka-javascript';

/**
 * @description Configuration for the RDKafka producer.
 */
export type IRDKafkaProducerConfig = IConnectorConfig & {
  global: ProducerGlobalConfig;
  topic?: ProducerTopicConfig;
  pollInterval?: number;
};

/**
 * @description Producer connection interface with promisified methods.
 */
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

/**
 * @description Producer connector type.
 */
export type IRDKafkaProducerConnector = IConnector<
  IRDKafkaProducerConfig,
  IRDKafkaProducerConnection
>;
