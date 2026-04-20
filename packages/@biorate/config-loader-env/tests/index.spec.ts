import { expect } from 'vitest';
import { root } from './__mocks__';

describe('@biorate/config-loader-env', () => {
  beforeAll(async () => await root.$run());

  it('ENV TEST_ENV', () =>
    expect(root.config.get('TEST_ENV')).to.be.a('string').equal('test'));

  it('ENV HELLO', () =>
    expect(root.config.get('HELLO')).to.be.a('string').equal('WORLD'));

  it('ENV WORLD', () =>
    expect(root.config.get('WORLD')).to.be.a('string').equal('HELLO'));

  it('ENV TEMPLATE', () =>
    expect(root.config.get('TEMPLATE')).to.be.a('string').equal('HELLO_WORLD'));
});
