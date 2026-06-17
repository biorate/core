import { inject, container, Types, Core } from '@biorate/inversion';
import { IConfig, Config } from '@biorate/config';
import { ClickhouseConnector } from '../../src';

export class Root extends Core() {
  @inject(ClickhouseConnector) public connector: ClickhouseConnector;
}

container.bind<IConfig>(Types.Config).to(Config).inSingletonScope();
container.bind<ClickhouseConnector>(ClickhouseConnector).toSelf().inSingletonScope();
container.bind<Root>(Root).toSelf().inSingletonScope();

container.get<IConfig>(Types.Config).merge({
  Clickhouse: [
    {
      name: 'connection',
      options: {},
    },
  ],
});

/** @description Lazy DI root — set `UNIMOCK` (e.g. `replay` / `record`) before calling. */
export function getTestRoot(): Root {
  return container.get<Root>(Root);
}
