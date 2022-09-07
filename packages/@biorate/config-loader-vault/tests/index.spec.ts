import { expect } from 'chai';
import { root } from './__mocks__';

describe('@biorate/config-loader-env', function () {
  before(async () => await root.$run());

  it('ENV TEST_ENV', () =>
    expect(root.config.get('TEST_ENV')).to.be.a('string').equal('test'));
});
