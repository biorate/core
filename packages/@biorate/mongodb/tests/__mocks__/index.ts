import { use } from 'chai';
import { jestSnapshotPlugin } from 'mocha-chai-jest-snapshot';
import { inject, container, Types, Core } from '@biorate/inversion';
import { IConfig, Config } from '@biorate/config';
import { MongoDBConnector, IMongoDBConnector, model, ReturnModelType } from '../../src';
import { TestModel } from './models';

export * from './models';

use(jestSnapshotPlugin());

export const dbName = 'test';

export class Root extends Core() {
  @inject(MongoDBConnector) public connector: IMongoDBConnector;
  @model(TestModel) public test: ReturnModelType<typeof TestModel>;
}

container.bind<IConfig>(Types.Config).to(Config).inSingletonScope();
container.bind<IMongoDBConnector>(MongoDBConnector).toSelf().inSingletonScope();
container.bind<Root>(Root).toSelf().inSingletonScope();

container.get<IConfig>(Types.Config).merge({
  MongoDB: [
    {
      name: 'connection',
      host: 'mongodb://localhost:27017/',
      options: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        dbName,
      },
    },
  ],
});
