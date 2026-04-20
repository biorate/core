import { expect } from 'vitest';
import { root } from './__mocks__';

describe('@biorate/file-config', () => {
  beforeAll(async () => await root.$run());

  it('config.json', () => expect(root.config.get('base')).to.be.a('boolean').equal(true));

  it('config.debug.json', () =>
    expect(root.config.get('environment')).to.be.a('boolean').equal(true));

  it('package.json', () => expect(root.config.get('package')).toMatchSnapshot());
});
