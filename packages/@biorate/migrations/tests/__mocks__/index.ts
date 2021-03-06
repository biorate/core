import { use } from 'chai';
import { unlinkSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';
import { jestSnapshotPlugin } from 'mocha-chai-jest-snapshot';
import { container, Types } from '@biorate/inversion';
import { IConfig } from '@biorate/config';
import '../../src/default.config';

use(jestSnapshotPlugin());

const storage = join(tmpdir(), 'sqlite-test.db');

try {
  unlinkSync(storage);
} catch {}

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
