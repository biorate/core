import { Connector, IConnector, IConnectorConfig } from '../index';

export class TestConnection {
  public constructor(public readonly name: string) {}
}

/** @description Minimal in-memory connector for tests and custom memory implementations. */
export class TestConnector extends Connector<IConnectorConfig, TestConnection> {
  protected readonly namespace = 'TestConnector';

  protected async connect(config: IConnectorConfig) {
    return new TestConnection(config.name);
  }
}

export type { IConnector, IConnectorConfig };
