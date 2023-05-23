import { expect } from 'chai';
import { writeFileSync, unlinkSync } from 'fs';
import { root, tmpFile } from './__mocks__';

describe('@biorate/config-loader-fs', function () {
  before(async () => {
    writeFileSync(tmpFile, JSON.stringify({ temp: true }));
    await root.$run();
  });

  after(() => {
    unlinkSync(tmpFile);
  });

  it('config.json', () => expect(root.config.get('root')).to.be.a('boolean').equal(true));

  it('package.json', () => expect(root.config.get('package')).toMatchSnapshot());

  it('config.debug.json', () =>
    expect(root.config.get('debug')).to.be.a('boolean').equal(true));

  it('config.nested.json', () =>
    expect(root.config.get('nested')).to.be.a('boolean').equal(true));

  it('config.tmp.json', () =>
    expect(root.config.get('temp.temp')).to.be.a('boolean').equal(true));
});
