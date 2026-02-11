import { inject, container, Types, Core } from '@biorate/inversion';
import { IConfig, Config } from '@biorate/config';
import {
  KafkaJSAdminConnector,
  KafkaJSProducerConnector,
  KafkaJSConsumerConnector,
} from '../../src';

export const topic = 'kafkajs';

export class Root extends Core() {
  @inject(KafkaJSAdminConnector) public admin: KafkaJSAdminConnector;
  @inject(KafkaJSProducerConnector) public producer: KafkaJSProducerConnector;
  @inject(KafkaJSConsumerConnector) public consumer: KafkaJSConsumerConnector;
}

container.bind<IConfig>(Types.Config).to(Config).inSingletonScope();
container.bind<KafkaJSAdminConnector>(KafkaJSAdminConnector).toSelf().inSingletonScope();
container
  .bind<KafkaJSProducerConnector>(KafkaJSProducerConnector)
  .toSelf()
  .inSingletonScope();
container
  .bind<KafkaJSConsumerConnector>(KafkaJSConsumerConnector)
  .toSelf()
  .inSingletonScope();
container.bind<Root>(Root).toSelf().inSingletonScope();

container.get<IConfig>(Types.Config).merge({
  KafkaJSGlobal: {
    brokers: ['localhost:9092'],
    clientId: 'test-app',
    logLevel: 1,
  },
  KafkaJSAdmin: [
    {
      name: 'admin',
      global: '#{KafkaJSGlobal}',
    },
  ],
  KafkaJSProducer: [
    {
      name: 'producer',
      global: '#{KafkaJSGlobal}',
      options: {
        transactionalId: 'my-transactional-producer',
        maxInFlightRequests: 1,
        idempotent: true,
      },
    },
  ],
  KafkaJSConsumer: [
    {
      name: 'consumer',
      global: '#{KafkaJSGlobal}',
      subscribe: { topics: [topic], fromBeginning: true },
      options: {
        groupId: 'kafkajs',
      },
    },
  ],
});

export const root = <Root>container.get<Root>(Root);
