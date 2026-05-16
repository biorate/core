/**
 * @description KafkaJS connector — admin, producer, consumer with Prometheus metrics.
 *
 * @example
 * ```ts
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
 *   KafkaJSGlobal: { brokers: ['localhost:9092'], clientId: 'test-app', logLevel: 1 },
 *   KafkaJSProducer: [{ name: 'producer', global: '#{KafkaJSGlobal}' }],
 * });
 *
 * (async () => {
 *   const root = container.get<Root>(Root);
 *   await root.$run();
 *   await root.producer!.current!.send({
 *     topic: 'test',
 *     messages: [{ key: 'key', value: 'hello' }],
 *   });
 * })();
 * ```
 */
export * from './connectors';
export * from './errors';
export * from './interfaces';
