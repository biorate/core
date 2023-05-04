import { Connector, IConnector, IConnectorConfig } from '../..';
import { inject, container, Types, Core } from '@biorate/inversion';
import { IConfig, Config } from '@biorate/config';

export class Connection {
  public name: string;

  public constructor(name: string) {
    this.name = name;
  }
}

export class TestConnector extends Connector<IConnectorConfig, Connection> {
  private '#connections': Map<string, Connection>;
  private '#current': Connection | undefined;
  protected namespace = 'TestConnector';

  protected async connect(config: IConnectorConfig) {
    return new Connection(config.name);
  }
}

export class Root extends Core() {
  @inject(TestConnector) public connector: IConnector<IConnectorConfig, Connection>;
}

container.bind(Types.Config).to(Config).inSingletonScope();
container.bind(TestConnector).toSelf().inSingletonScope();
container.bind(Root).toSelf().inSingletonScope();

container.get<IConfig>(Types.Config).merge({
  TestConnector: [{ name: 'test-connection' }],
});
