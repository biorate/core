import { assert } from 'chai';
import { root, key, value } from './__mocks__';

describe('@biorate/config-loader', function () {
  before(async () => await root.$run());

  it('config-loader-test', () => assert.equal(root.config.get(key), value));
});
