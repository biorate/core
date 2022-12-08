import { injectable } from '@biorate/inversion';
import { Connector } from '@biorate/connector';
import { Kafka, Partitioners, ProducerRecord } from 'kafkajs';
import { counter, Counter, histogram, Histogram } from '@biorate/prometheus';
import { KafkaJSProducerCantConnectError } from '../errors';
import { IKafkaJSProducerConfig, IKafkaJSProducerConnection } from '../interfaces';
import { LogCreator } from '../logger';
/**
 * @description KafkaJS producer connector
 *
 * ### Features:
 * - producer connector manager for KafkaJS
 *
 * @example
 * ```
 * import { inject, container, Types, Core } from '@biorate/inversion';
 * import { IConfig, Config } from '@biorate/config';
 * import { KafkaJSProducerConnector } from '@biorate/kafkajs';
 *
 * class Root extends Core() {
 *   @inject(KafkaJSProducerConnector) public producer: KafkaJSProducerConnector;
 * }
 *
 * container.bind<IConfig>(Types.Config).to(Config).inSingletonScope();
 * container.bind<KafkaJSProducerConnector>(KafkaJSProducerConnector).toSelf().inSingletonScope();
 * container.bind<Root>(Root).toSelf().inSingletonScope();
 *
 * container.get<IConfig>(Types.Config).merge({
 *   KafkaJSGlobal: {
 *     brokers: ['localhost:9092'],
 *     clientId: 'test-app',
 *     logLevel: 1,
 *   },
 *   KafkaJSProducer: [
 *     {
 *       name: 'producer',
 *       global: '#{KafkaJSGlobal}',
 *     },
 *   ],
 * });
 *
 * (async () => {
 *   const topic = 'test-kafkajs';
 *   const root = container.get<Root>(Root);
 *   await root.$run();
 *   await root.producer!.current!.send({
 *     topic,
 *     messages: [
 *       { key: 'key 1', value: 'hello world 1' },
 *       { key: 'key 2', value: 'hello world 2' },
 *       { key: 'key 3', value: 'hello world 3' },
 *     ],
 *   });
 * })();
 * ```
 */
@injectable()
export class KafkaJSProducerConnector extends Connector<
  IKafkaJSProducerConfig,
  IKafkaJSProducerConnection
> {
  /**
   * @description Counter
   */
  @counter({
    name: 'kafka_producer_seconds_count',
    help: 'Kafka producer seconds count',
    labelNames: ['topic', 'status'],
  })
  protected counter: Counter;
  /**
   * @description Histogram
   */
  @histogram({
    name: 'kafka_producer_seconds',
    help: 'Kafka producer seconds bucket',
    labelNames: ['topic', 'status'],
    buckets: [5, 10, 20, 50, 100, 300, 500, 1000, 2000, 3000, 5000, 10000],
  })
  protected histogram: Histogram;
  /**
   * @description Namespace path for fetching configuration
   */
  protected readonly namespace = 'KafkaJSProducer';
  /**
   * @description Create connection
   */
  protected async connect(config: IKafkaJSProducerConfig) {
    let connection: IKafkaJSProducerConnection;
    try {
      connection = new Kafka({
        logCreator: LogCreator,
        ...config.global,
      }).producer({
        createPartitioner: Partitioners[config.partitioner ?? 'DefaultPartitioner'],
        ...config.options,
      });
      await connection.connect();
    } catch (e: unknown) {
      throw new KafkaJSProducerCantConnectError(<Error>e);
    }
    return connection;
  }
  /**
   * @description Send
   */
  public async send(name: string, record: ProducerRecord) {
    const connection = this.get(name);
    const start = Date.now();
    try {
      const result = await connection.send(record);
      this.histogram
        .labels({ topic: record.topic, status: 200 })
        .observe(Date.now() - start);
      this.counter
        .labels({ topic: record.topic, status: 200 })
        .inc(record.messages.length);
      return result;
    } catch (e) {
      this.histogram
        .labels({ topic: record.topic, status: 400 })
        .observe(Date.now() - start);
      this.counter
        .labels({ topic: record.topic, status: 400 })
        .inc(record.messages.length);
      throw e;
    }
  }
  /**
   * @description Transaction
   */
  public async transaction(name: string, record: ProducerRecord) {
    const connection = this.get(name);
    const start = Date.now();
    const transaction = await connection.transaction();
    try {
      await transaction.send(record);
      await transaction.commit();
      this.histogram
        .labels({ topic: record.topic, status: 200 })
        .observe(Date.now() - start);
      this.counter
        .labels({ topic: record.topic, status: 200 })
        .inc(record.messages.length);
    } catch (e) {
      await transaction.abort();
      this.histogram
        .labels({ topic: record.topic, status: 400 })
        .observe(Date.now() - start);
      this.counter
        .labels({ topic: record.topic, status: 400 })
        .inc(record.messages.length);
      throw e;
    }
  }
}
