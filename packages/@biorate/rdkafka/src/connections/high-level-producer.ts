import {
  KafkaConsumer,
  LibrdKafkaError,
  HighLevelProducer,
  TopicPartitionOffset,
  MetadataOptions,
  NumberNullUndefined,
  MessageHeader,
} from 'node-rdkafka';
import { counter, Counter, histogram, Histogram } from '@biorate/prometheus';
import { timeDiff } from '../helpers';
import { IRDKafkaHighLevelProducerConnection } from '../interfaces';
/**
 * @description RDKafka high level producer connection
 */
export class RDKafkaHighLevelProducerConnection
  extends HighLevelProducer
  implements IRDKafkaHighLevelProducerConnection
{
  @counter({
    name: 'kafka_producer_seconds_count',
    help: 'Kafka producer seconds count',
    labelNames: ['topic', 'status'],
  })
  protected counter: Counter;
  @histogram({
    name: 'kafka_producer_seconds',
    help: 'Kafka producer seconds bucket',
    labelNames: ['topic', 'status'],
    buckets: [5, 10, 20, 50, 100, 300, 500, 1000, 2000, 3000, 5000, 10000],
  })
  protected histogram: Histogram;

  public producePromise(
    topic: string,
    partition: NumberNullUndefined,
    message: any,
    key: any,
    timestamp: NumberNullUndefined,
    headers?: MessageHeader[],
  ) {
    return new Promise<NumberNullUndefined>((resolve, reject) => {
      const time = timeDiff();
      const callback = (e: LibrdKafkaError, offset: NumberNullUndefined) => {
        this.counter.labels({ topic, status: e ? 500 : 200 }).inc(1);
        this.histogram.labels({ topic, status: e ? 500 : 200 }).observe(time());
        e ? reject(e) : resolve(offset);
      };
      headers
        ? this.produce(topic, partition, message, key, timestamp, headers, callback)
        : this.produce(topic, partition, message, key, timestamp, callback);
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
