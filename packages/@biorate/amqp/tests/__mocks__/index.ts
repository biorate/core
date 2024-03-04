import { use } from 'chai';
import { jestSnapshotPlugin } from 'mocha-chai-jest-snapshot';
import { inject, container, Types, Core } from '@biorate/inversion';
import { IConfig, Config } from '@biorate/config';
import { AmqpConnector } from '../../src';

use(jestSnapshotPlugin());

export const connectionName = 'amqp';
export const channelName = 'test';

export class Root extends Core() {
  @inject(AmqpConnector) public connector: AmqpConnector;
}

container.bind<IConfig>(Types.Config).to(Config).inSingletonScope();
container.bind<AmqpConnector>(AmqpConnector).toSelf().inSingletonScope();
container.bind<Root>(Root).toSelf().inSingletonScope();

container.get<IConfig>(Types.Config).merge({
  Amqp: [
    {
      name: connectionName,
      urls: ['amqp://localhost:5672'],
    },
  ],
});

export const root = <Root>container.get<Root>(Root);
