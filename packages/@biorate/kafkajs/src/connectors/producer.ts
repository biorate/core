import { injectable } from '@biorate/inversion';
import { Connector } from '@biorate/connector';
import { Kafka, Partitioners } from 'kafkajs';
import { KafkaJSProducerCantConnectError } from '../errors';
import { IKafkaJSProducerConfig, IKafkaJSProducerConnection } from '../interfaces';
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
   * @description Namespace path for fetching configuration
   */
  protected readonly namespace = 'KafkaJSProducer';
  /**
   * @description Create connection
   */
  protected async connect(config: IKafkaJSProducerConfig) {
    let connection: IKafkaJSProducerConnection;
    try {
      connection = new Kafka(config.global).producer({
        createPartitioner: Partitioners[config.partitioner ?? 'DefaultPartitioner'],
        ...config.options,
      });
      await connection.connect();
    } catch (e: unknown) {
      throw new KafkaJSProducerCantConnectError(<Error>e);
    }
    return connection;
  }
}
