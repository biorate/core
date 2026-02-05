import { use, expect } from 'chai';
import { jestSnapshotPlugin } from 'mocha-chai-jest-snapshot';
import { fork } from 'child_process';
import { path } from '@biorate/tools';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

use(jestSnapshotPlugin());

describe('shutdown-hook', function () {
  this.timeout(10000);

  for (const file of [
    'process.EXIT',
    // 'process.SHUTDOWN',
    // 'process.SIGINT',
    // 'process.SIGTERM',
  ])
    it(file, (done) => {
      const child = fork(path.create(__dirname, '__mocks__', `${file}.ts`), [], {
        execArgv: ['-r', 'ts-node/esm'],
        stdio: ['pipe', 'pipe', 'pipe', 'ipc']
        // stdio: 'overlapped',
      });
      child.stdout?.on?.('data', (data) => {
        expect(data.toString()).toMatchSnapshot();
        done();
      });
      child.stderr?.on?.('data', (data) => {
        console.log(data.toString());
        // expect(data.toString()).toMatchSnapshot();
        // done();
      });
    });
});
