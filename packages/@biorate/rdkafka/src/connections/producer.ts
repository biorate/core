import {
  KafkaConsumer,
  LibrdKafkaError,
  Producer,
  TopicPartitionOffset,
  MetadataOptions,
} from 'node-rdkafka';
import { IRDKafkaProducerConnection } from '../interfaces';
// noinspection JSAnnotator
/**
 * @description RDKafka producer connection
 */
export class RDKafkaProducerConnection
  extends Producer
  implements IRDKafkaProducerConnection
{
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
