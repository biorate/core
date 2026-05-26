import { inject, container, Types, Core } from '@biorate/inversion';
import { IConfig, Config } from '@biorate/config';
import { dockerEndpoints, getProfileConfig } from '@biorate/testing';
import { AmqpConnector } from '../../src';

export const connectionName = dockerEndpoints.amqp.name;
export const channelName = 'test';

export class Root extends Core() {
  @inject(AmqpConnector) public connector: AmqpConnector;
}

container.bind<IConfig>(Types.Config).to(Config).inSingletonScope();
container.bind<AmqpConnector>(AmqpConnector).toSelf().inSingletonScope();
container.bind<Root>(Root).toSelf().inSingletonScope();

container.get<IConfig>(Types.Config).merge(getProfileConfig(['amqp'], 'docker'));

export const root = <Root>container.get<Root>(Root);
