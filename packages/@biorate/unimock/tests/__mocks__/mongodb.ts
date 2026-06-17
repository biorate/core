import { inject, container, Types, Core } from '@biorate/inversion';
import { IConfig, Config } from '@biorate/config';
import { MongoDBConnector as RawMongoDBConnector } from '@biorate/mongodb';
import { Mockable } from '../../src';

@Mockable({})
export class MongoDBConnector extends RawMongoDBConnector {}

class Root extends Core() {
  @inject(MongoDBConnector) public connector: MongoDBConnector;
}

const config = {
  MongoDB: [
    {
      name: 'connection',
      host: 'mongodb://localhost:27017/',
      options: { dbName: 'test' },
    },
  ],
};

export async function setup() {
  if (!container.isBound(Types.Config))
    container.bind<IConfig>(Types.Config).to(Config).inSingletonScope();
  container.get<IConfig>(Types.Config).merge(config);
  container.bind(MongoDBConnector).toSelf().inSingletonScope();
  container.bind(Root).toSelf().inSingletonScope();
  const root = container.get<Root>(Root);
  await root.$run();
  return root as { connector: MongoDBConnector };
}

export function teardown() {
  container.unbind(Root);
  if (container.isBound(MongoDBConnector)) container.unbind(MongoDBConnector);
}
