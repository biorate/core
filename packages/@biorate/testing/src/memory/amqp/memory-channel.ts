import { EventEmitter } from 'events';
import { ConsumeMessage } from 'amqplib';
import { ICreateChannelOpts } from '@biorate/amqp';

type MemoryConsumer = (message: ConsumeMessage | null) => void;

/** @description In-memory AMQP channel wrapper. */
export class MemoryAmqpChannelWrapper extends EventEmitter {
  readonly #queues = new Map<string, MemoryConsumer[]>();
  readonly #exchanges = new Set<string>();

  #ready: Promise<void>;

  public constructor(public readonly options: ICreateChannelOpts) {
    super();
    this.#ready = this.#runSetup();
  }

  public async waitReady() {
    await this.#ready;
  }

  async #runSetup() {
    const setup = this.options.setup as
      | ((channel: MemoryAmqpChannel, done: () => void) => Promise<void> | void)
      | undefined;
    if (setup) await setup(this.#channel, () => undefined);
    this.emit('connect');
  }

  readonly #channel: MemoryAmqpChannel = {
    assertExchange: async (exchange: string) => {
      this.#exchanges.add(exchange);
    },
    assertQueue: async (queue: string) => {
      if (!this.#queues.has(queue)) this.#queues.set(queue, []);
    },
    bindQueue: async (queue: string) => {
      if (!this.#queues.has(queue)) this.#queues.set(queue, []);
    },
    consume: async (queue: string, onMessage: MemoryConsumer) => {
      const consumers = this.#queues.get(queue) ?? [];
      consumers.push(onMessage);
      this.#queues.set(queue, consumers);
    },
    publish: (exchange: string, routingKey: string, content: Buffer) => {
      void exchange;
      void routingKey;
      const payload = <ConsumeMessage>{
        content,
        fields: {},
        properties: {},
      };
      for (const consumers of this.#queues.values()) {
        consumers.forEach((consumer) => consumer(payload));
      }
    },
  };

  public publish(exchange: string, routingKey: string, content: unknown) {
    const buffer = Buffer.from(
      typeof content === 'string' ? content : JSON.stringify(content),
    );
    this.#channel.publish(exchange, routingKey, buffer);
    return true;
  }

  public async close() {
    this.#queues.clear();
    this.#exchanges.clear();
  }
}

type MemoryAmqpChannel = {
  assertExchange: (exchange: string, type?: string) => Promise<void>;
  assertQueue: (queue: string, options?: Record<string, unknown>) => Promise<void>;
  bindQueue: (queue: string, exchange: string, pattern: string) => Promise<void>;
  consume: (queue: string, onMessage: MemoryConsumer) => Promise<void>;
  publish: (exchange: string, routingKey: string, content: Buffer) => void;
};
