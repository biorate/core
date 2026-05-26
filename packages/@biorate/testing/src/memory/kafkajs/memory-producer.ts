import { Producer, ProducerRecord, RecordMetadata } from 'kafkajs';
import { MemoryKafkaBus } from './memory-bus';

/** @description In-memory KafkaJS producer connection. */
export class MemoryKafkaProducer implements Pick<Producer, 'connect' | 'disconnect' | 'send'> {
  public constructor(private readonly bus: MemoryKafkaBus = MemoryKafkaBus.shared) {}

  public async connect() {
    return undefined;
  }

  public async disconnect() {
    return undefined;
  }

  public async send(record: ProducerRecord): Promise<RecordMetadata[]> {
    return this.bus.publish(record);
  }

  public async transaction() {
    const bus = this.bus;
    return {
      send: async (record: ProducerRecord) => {
        bus.publish(record);
      },
      commit: async () => undefined,
      abort: async () => undefined,
    };
  }
}
