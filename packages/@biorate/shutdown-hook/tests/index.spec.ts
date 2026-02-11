import { expect } from 'vitest';
import { fork } from 'child_process';
import { path } from '@biorate/tools';

describe('shutdown-hook', () => {
  for (const file of [
    'process.EXIT',
    'process.SHUTDOWN',
    'process.SIGINT',
    'process.SIGTERM',
  ])
    it(
      file,
      () =>
        new Promise((done) => {
          const child = fork(path.create(__dirname, '__mocks__', `${file}.ts`), [], {
            execArgv: ['-r', 'ts-node/register'],
            stdio: 'overlapped',
          });
          child.stdout?.on?.('data', (data) => {
            expect(data.toString()).toMatchSnapshot();
            done(void 0);
          });
        }),
    );
});
