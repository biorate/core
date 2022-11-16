import { promises as fs } from 'fs';
import { path } from '@biorate/tools';
import { expect } from 'chai';
import { root, paths, data } from './__mocks__';

describe('@biorate/config-loader-vault', function () {
  before(async () => await root.$run());

  it('merge', () =>
    expect(root.config.get(Object.keys(data.config)[0]))
      .to.be.a('string')
      .equal(data.config.hello));

  it('files', async () => {
    expect(
      await fs.readFile(
        path.create(process.cwd(), 'downloads', Object.keys(data.files)[0]),
        'utf-8',
      ),
    )
      .to.be.a('string')
      .equal(data.files['hello.txt']);
  });

  it('cache', async () => {
    expect(await fs.readFile(path.create(process.cwd(), 'cache', paths.config), 'utf-8'))
      .to.be.a('string')
      .equal(JSON.stringify(data.config));
    expect(await fs.readFile(path.create(process.cwd(), 'cache', paths.files), 'utf-8'))
      .to.be.a('string')
      .equal(JSON.stringify(data.files));
  });

  after(async () => {
    await fs.rm(path.create(process.cwd(), 'cache'), { recursive: true, force: true });
    await fs.rm(path.create(process.cwd(), 'keys'), { recursive: true, force: true });
  });
});
