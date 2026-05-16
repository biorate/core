import { IConnectorConfig, IConnector } from '@biorate/connector';
import type {
  HighLevelProducer,
  ProducerGlobalConfig,
  ProducerTopicConfig,
  TopicPartitionOffset,
  KafkaConsumer,
  MetadataOptions,
  NumberNullUndefined,
  MessageHeader,
} from '@confluentinc/kafka-javascript';

/**
 * @description Configuration for the RDKafka high-level producer.
 */
export type IRDKafkaHighLevelProducerConfig = IConnectorConfig & {
  global: ProducerGlobalConfig;
  topic?: ProducerTopicConfig;
  pollInterval?: number;
};

/**
 * @description High-level producer connection interface with promisified methods.
 */
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

/**
 * @description High-level producer connector type.
 */
export type IRDKafkaHighLevelProducerConnector = IConnector<
  IRDKafkaHighLevelProducerConfig,
  IRDKafkaHighLevelProducerConnection
>;
