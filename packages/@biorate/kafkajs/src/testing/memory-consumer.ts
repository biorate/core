import { Consumer, EachMessagePayload } from 'kafkajs';
import { MemoryKafkaBus } from './memory-bus';

/** @description In-memory KafkaJS consumer connection. */
export class MemoryKafkaConsumer implements Pick<Consumer, 'connect' | 'disconnect' | 'subscribe' | 'run'> {
  readonly #handlers: Array<(payload: EachMessagePayload) => Promise<void>> = [];
  #topics: string[] = [];

  public constructor(private readonly bus: MemoryKafkaBus = MemoryKafkaBus.shared) {}

  public async connect() {
    return undefined;
  }

  public async disconnect() {
    this.#handlers.length = 0;
    this.#topics = [];
  }

  public async subscribe(options: { topics: string[]; fromBeginning?: boolean }) {
    void options.fromBeginning;
    this.#topics = options.topics;
    for (const topic of options.topics) {
      this.bus.subscribe(topic, (message) => {
        void this.#dispatch(topic, message);
      });
    }
  }

  public async run(config: {
    eachMessage?: (payload: EachMessagePayload) => Promise<void>;
  }) {
    if (config.eachMessage) this.#handlers.push(config.eachMessage);
    for (const topic of this.#topics) {
      for (const message of this.bus.drain(topic)) {
        await this.#dispatch(topic, message);
      }
    }
  }

  async #dispatch(
    topic: string,
    message: { key?: string | Buffer | null; value?: string | Buffer | null; partition?: number },
  ) {
    const payload = {
      topic,
      partition: message.partition ?? 0,
      message: {
        key: message.key ? Buffer.from(String(message.key)) : null,
        value: message.value ? Buffer.from(String(message.value)) : null,
        timestamp: String(Date.now()),
        attributes: 0,
        offset: '0',
        headers: {},
      },
      heartbeat: async () => undefined,
      pause: () => () => undefined,
    } satisfies EachMessagePayload;

    for (const handler of this.#handlers) {
      await handler(payload);
    }
  }
}
