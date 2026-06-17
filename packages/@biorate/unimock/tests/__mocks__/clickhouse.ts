import { inject, container, Types, Core } from '@biorate/inversion';
import { IConfig, Config } from '@biorate/config';
import { ClickhouseConnector as ChConnector } from '@biorate/clickhouse';
import { Mockable } from '../../src';

@Mockable({})
export class ClickhouseConnector extends ChConnector {}

class Root extends Core() {
  @inject(ClickhouseConnector) public connector: ClickhouseConnector;
}

const config = {
  Clickhouse: [{ name: 'connection', options: {} }],
};

export async function setup() {
  if (!container.isBound(Types.Config))
    container.bind<IConfig>(Types.Config).to(Config).inSingletonScope();
  container.get<IConfig>(Types.Config).merge(config);
  container.bind(ClickhouseConnector).toSelf().inSingletonScope();
  container.bind(Root).toSelf().inSingletonScope();
  const root = container.get<Root>(Root);
  await root.$run();
  return root as { connector: ClickhouseConnector };
}

export function teardown() {
  container.unbind(Root);
  if (container.isBound(ClickhouseConnector)) container.unbind(ClickhouseConnector);
}
