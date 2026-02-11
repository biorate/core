import { inject, container, Types, Core } from '@biorate/inversion';
import { IConfig, Config } from '@biorate/config';
import { MinioConnector } from '../../src';

export class Root extends Core() {
  @inject(MinioConnector) public connector: MinioConnector;
}

container.bind<IConfig>(Types.Config).to(Config).inSingletonScope();
container.bind<MinioConnector>(MinioConnector).toSelf().inSingletonScope();
container.bind<Root>(Root).toSelf().inSingletonScope();

container.get<IConfig>(Types.Config).merge({
  Minio: [
    {
      name: 'connection',
      options: {
        endPoint: 'localhost',
        port: 9000,
        accessKey: 'admin',
        secretKey: 'minioadmin',
        useSSL: false,
      },
    },
  ],
});

export const root = container.get<Root>(Root);
