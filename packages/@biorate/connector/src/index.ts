import { init, inject, injectable, Types } from '@biorate/inversion';
import { IConfig } from '@biorate/config';
import { IConnector } from './interfaces';
import { ConnectorMultiplyInstanceError } from './errors';
export * from './errors';
export * from './interfaces';

@injectable()
export abstract class Connector<C extends { name: string }, T = any>
  implements IConnector
{
  protected static instance = null;

  @inject(Types.Config) protected config: IConfig;

  protected connections = new Map<string, T>();

  protected abstract path: string;

  protected abstract connect(config: C): T;

  protected current: string = null;

  @init() protected async initialize() {
    if (Connector.instance)
      throw new ConnectorMultiplyInstanceError(this.constructor.name);
    Connector.instance = this;
    for (const config of this.config.get<C[]>(this.path)) {
      this.connections.set(config.name, await this.connect(config));
      if (!this.current) this.current = config.name;
    }
  }

  public static connection<T = any>(name: string): T {
    return this.instance.connections.get(name);
  }
}
