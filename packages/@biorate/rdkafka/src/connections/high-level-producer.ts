import {
  KafkaConsumer,
  LibrdKafkaError,
  HighLevelProducer,
  TopicPartitionOffset,
  MetadataOptions,
  NumberNullUndefined,
  MessageHeader,
} from 'node-rdkafka';
import { IRDKafkaHighLevelProducerConnection } from '../interfaces';
/**
 * @description RDKafka high level producer connection
 */
export class RDKafkaHighLevelProducerConnection
  extends HighLevelProducer
  implements IRDKafkaHighLevelProducerConnection
{
  public producePromise(
    topic: string,
    partition: NumberNullUndefined,
    message: any,
    key: any,
    timestamp: NumberNullUndefined,
    headers?: MessageHeader[],
  ) {
    return new Promise<NumberNullUndefined>((resolve, reject) => {
      const callback = (e: LibrdKafkaError, offset: NumberNullUndefined) =>
        e ? reject(e) : resolve(offset);
      headers
        ? super.produce(topic, partition, message, key, timestamp, headers, callback)
        : super.produce(topic, partition, message, key, timestamp, callback);
    });
  }

  public connectPromise(metadataOptions?: MetadataOptions) {
    return new Promise<this>((resolve, reject) =>
      super.connect(metadataOptions, (e: LibrdKafkaError) =>
        e ? reject(e) : resolve(this),
      ),
    );
  }

  public initTransactionsPromise(timeout?: number) {
    return new Promise<void>((resolve, reject) => {
      const callback = (e: LibrdKafkaError) => (e ? reject(e) : resolve());
      timeout
        ? super.initTransactions(timeout, callback)
        : super.initTransactions(callback);
    });
  }

  public beginTransactionPromise() {
    return new Promise<void>((resolve, reject) =>
      super.beginTransaction((e: LibrdKafkaError) => (e ? reject(e) : resolve())),
    );
  }

  public commitTransactionPromise(timeout?: number) {
    return new Promise<void>((resolve, reject) => {
      const callback = (e: LibrdKafkaError) => (e ? reject(e) : resolve());
      timeout
        ? super.commitTransaction(timeout, callback)
        : super.commitTransaction(callback);
    });
  }

  public abortTransactionPromise(timeout?: number) {
    return new Promise<void>((resolve, reject) => {
      const callback = (e: LibrdKafkaError) => (e ? reject(e) : resolve());
      timeout
        ? super.abortTransaction(timeout, callback)
        : super.abortTransaction(callback);
    });
  }

  public sendOffsetsToTransactionPromise(
    offsets: TopicPartitionOffset[],
    consumer: KafkaConsumer,
    timeout?: number,
  ) {
    return new Promise<void>((resolve, reject) => {
      const callback = (e: LibrdKafkaError) => (e ? reject(e) : resolve());
      timeout
        ? super.sendOffsetsToTransaction(offsets, consumer, timeout, callback)
        : super.sendOffsetsToTransaction(offsets, consumer, callback);
    });
  }
}
