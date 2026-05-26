import { ProducerRecord, RecordMetadata } from 'kafkajs';

export type MemoryKafkaMessage = {
  key?: string | Buffer | null;
  value?: string | Buffer | null;
  partition?: number;
  headers?: Record<string, string | Buffer>;
};

/** @description Shared in-memory topic storage for producer and consumer mocks. */
export class MemoryKafkaBus {
  static readonly #global = new MemoryKafkaBus();

  public static get shared() {
    return this.#global;
  }

  readonly #topics = new Map<string, MemoryKafkaMessage[]>();
  readonly #handlers = new Map<string, Set<(message: MemoryKafkaMessage) => void>>();

  public reset() {
    this.#topics.clear();
    this.#handlers.clear();
  }

  public publish(record: ProducerRecord): RecordMetadata[] {
    const list = this.#topics.get(record.topic) ?? [];
    const metadata: RecordMetadata[] = [];

    record.messages.forEach((message: ProducerRecord['messages'][number], index: number) => {
      const stored: MemoryKafkaMessage = {
        key: message.key ?? null,
        value: message.value ?? null,
        partition: message.partition ?? 0,
        headers: message.headers as Record<string, string | Buffer> | undefined,
      };
      list.push(stored);
      metadata.push({
        topicName: record.topic,
        partition: stored.partition ?? 0,
        errorCode: 0,
        offset: String(list.length - 1),
        timestamp: String(Date.now()),
      });
      this.#handlers.get(record.topic)?.forEach((handler) => handler(stored));
    });

    this.#topics.set(record.topic, list);
    return metadata;
  }

  public drain(topic: string) {
    return [...(this.#topics.get(topic) ?? [])];
  }

  public subscribe(topic: string, handler: (message: MemoryKafkaMessage) => void) {
    const handlers = this.#handlers.get(topic) ?? new Set();
    handlers.add(handler);
    this.#handlers.set(topic, handlers);
  }
}
