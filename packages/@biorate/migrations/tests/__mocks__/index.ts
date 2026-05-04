import { unlinkSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';
import { container, Types, init } from '@biorate/inversion';
import { IConfig } from '@biorate/config';
import { Root as RootBase } from '../../src/root';

const storage = join(tmpdir(), 'sqlite-test.db');

try {
  unlinkSync(storage);
} catch {}

class Root extends RootBase {
  @init() protected async initialize() {
    this.emit('end');
  }
}

container.unbind(RootBase);
container.bind<RootBase>(RootBase).to(Root).inSingletonScope();

export const root = container.get<RootBase>(RootBase);

root.$run().catch(console.error);

container.get<IConfig>(Types.Config).merge({
  Sequelize: [
    {
      name: 'sqlite',
      options: {
        logging: false,
        dialect: 'sqlite',
        storage,
      },
    },
  ],
  migrations: {
    directory: '/tests/migrations',
  },
});
