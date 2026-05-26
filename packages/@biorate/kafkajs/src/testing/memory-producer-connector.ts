import { Connector } from '@biorate/connector';
import { injectable } from '@biorate/inversion';
import { ProducerRecord } from 'kafkajs';
import { IKafkaJSProducerConfig } from '../interfaces';
import { MemoryKafkaBus } from './memory-bus';
import { MemoryKafkaProducer } from './memory-producer';

export type IMemoryKafkaJSProducerConnection = MemoryKafkaProducer;

/** @description In-memory KafkaJS producer connector (no Prometheus metrics). */
@injectable()
export class MemoryKafkaJSProducerConnector extends Connector<
  IKafkaJSProducerConfig,
  IMemoryKafkaJSProducerConnection
> {
  protected readonly namespace = 'KafkaJSProducer';

  protected async connect() {
    const connection = new MemoryKafkaProducer(MemoryKafkaBus.shared);
    await connection.connect();
    return connection;
  }

  public async send(name: string, record: ProducerRecord) {
    return this.get(name).send(record);
  }

  public async transaction(name: string, record: ProducerRecord) {
    const tx = await this.get(name).transaction();
    await tx.send(record);
    await tx.commit();
  }
}
