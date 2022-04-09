import { IConnector } from '@biorate/connector';
import { inject, container, Types, Core } from '@biorate/inversion';
import { IConfig, Config } from '@biorate/config';
import {
  SchemaRegistryConnector,
  ISchemaRegistryConnection,
  ISchemaRegistryConfig,
} from '../../src';

export class Root extends Core() {
  @inject(SchemaRegistryConnector) public connector: IConnector<
    ISchemaRegistryConfig,
    ISchemaRegistryConnection
  >;
}

container.bind<IConfig>(Types.Config).to(Config).inSingletonScope();
container
  .bind<SchemaRegistryConnector>(SchemaRegistryConnector)
  .toSelf()
  .inSingletonScope();
container.bind<Root>(Root).toSelf().inSingletonScope();

container.get<IConfig>(Types.Config).merge({
  SchemaRegistry: [{ name: 'connection', baseURL: 'http://localhost:8081' }],
});
