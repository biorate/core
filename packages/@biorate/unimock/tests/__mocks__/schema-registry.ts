import { inject, container, Types, Core } from '@biorate/inversion';
import { IConfig, Config } from '@biorate/config';
import { SchemaRegistryConnector as BaseSchemaRegistryConnector } from '@biorate/schema-registry';
import { Mockable } from '../../src';

@Mockable({})
export class SchemaRegistryConnector extends BaseSchemaRegistryConnector {}

export const subject = 'unimock-test-subject';

class Root extends Core() {
  @inject(SchemaRegistryConnector) public connector: SchemaRegistryConnector;
}

const config = {
  SchemaRegistry: [{ name: 'connection', baseURL: 'http://localhost:8085' }],
};

export async function setup() {
  if (!container.isBound(Types.Config))
    container.bind<IConfig>(Types.Config).to(Config).inSingletonScope();
  container.get<IConfig>(Types.Config).merge(config);
  container.bind(SchemaRegistryConnector).toSelf().inSingletonScope();
  container.bind(Root).toSelf().inSingletonScope();
  const root = container.get<Root>(Root);
  await root.$run();
  return root as { connector: SchemaRegistryConnector };
}

export function teardown() {
  container.unbind(Root);
  if (container.isBound(SchemaRegistryConnector)) container.unbind(SchemaRegistryConnector);
}
