import { mkdir, stat } from 'fs/promises';
import { statSync } from 'fs';
import { expect } from 'chai';
import { cleanup } from '../src';

describe('@biorate/cleanup', function () {
  this.timeout(3e4);

  const paths = ['./tests/a', './tests/b', './tests/c'];

  before(async () => {
    for (const path of paths) await mkdir(path);
  });

  it('dir exists', async () => {
    for (const path of paths) expect(await stat(path)).to.be.not.null;
  });

  it('cleanup', async () => {
    await cleanup('./tests/{a,b,c}');
  });

  it('dir not exists', async () => {
    for (const path of paths) expect(() => statSync(path)).to.throws;
  });
});
