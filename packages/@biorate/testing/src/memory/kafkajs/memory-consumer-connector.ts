import { Connector } from '@biorate/connector';
import { injectable } from '@biorate/inversion';
import { IKafkaJSConsumerConfig } from '@biorate/kafkajs';
import { MemoryKafkaConsumer } from './memory-consumer';

export type IMemoryKafkaJSConsumerConnection = MemoryKafkaConsumer;

/** @description In-memory KafkaJS consumer connector (no Prometheus metrics). */
@injectable()
export class MemoryKafkaJSConsumerConnector extends Connector<
  IKafkaJSConsumerConfig,
  IMemoryKafkaJSConsumerConnection
> {
  protected readonly namespace = 'KafkaJSConsumer';

  protected async connect() {
    const connection = new MemoryKafkaConsumer();
    await connection.connect();
    return connection;
  }
}
