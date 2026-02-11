import { inject, container, Types, Core } from '@biorate/inversion';
import { IConfig, Config } from '@biorate/config';
import { SchemaRegistryConnector, ISchemaRegistryConnector } from '../../src';

export class Root extends Core() {
  @inject(SchemaRegistryConnector) public connector: ISchemaRegistryConnector;
}

container.bind<IConfig>(Types.Config).to(Config).inSingletonScope();
container
  .bind<ISchemaRegistryConnector>(SchemaRegistryConnector)
  .toSelf()
  .inSingletonScope();
container.bind<Root>(Root).toSelf().inSingletonScope();

container.get<IConfig>(Types.Config).merge({
  SchemaRegistry: [{ name: 'connection', baseURL: 'http://localhost:8085' }],
});

export const root = container.get<Root>(Root);
