import {
  KafkaConsumer,
  TopicPartitionOffset,
  LibrdKafkaError,
  MetadataOptions,
  TopicPartitionTime,
  TopicPartition,
  Message,
} from '@confluentinc/kafka-javascript';
import { IRDKafkaConsumerConnection } from '../interfaces';
// noinspection JSAnnotator
/**
 * @description RDKafka consumer connection
 */
export class RDKafkaConsumerConnection
  extends KafkaConsumer
  implements IRDKafkaConsumerConnection
{
  public consumePromise(number: number) {
    return new Promise<Message[]>((resolve, reject) =>
      super.consume(number, (e, messages) => (e ? reject(e) : resolve(messages))),
    );
  }

  public connectPromise(metadataOptions?: MetadataOptions) {
    return new Promise<this>((resolve, reject) =>
      super.connect(metadataOptions, (e: LibrdKafkaError) =>
        e ? reject(e) : resolve(this),
      ),
    );
  }

  public committedPromise(timeout: number, toppars?: TopicPartition[]) {
    return new Promise<this>((resolve, reject) => {
      const callback = (e: LibrdKafkaError) => (e ? reject(e) : resolve(this));
      toppars
        ? super.committed(toppars, timeout, callback)
        : super.committed(timeout, callback);
    });
  }

  public seekPromise(toppar: TopicPartitionOffset, timeout: number | null) {
    return new Promise<this>((resolve, reject) =>
      super.seek(toppar, timeout, (e: LibrdKafkaError) =>
        e ? reject(e) : resolve(this),
      ),
    );
  }

  public offsetsForTimesPromise(topicPartitions: TopicPartitionTime[], timeout?: number) {
    return new Promise<void>((resolve, reject) => {
      const callback = (e: LibrdKafkaError) => (e ? reject(e) : resolve());
      timeout
        ? super.offsetsForTimes(topicPartitions, timeout, callback)
        : super.offsetsForTimes(topicPartitions, callback);
    });
  }
}
