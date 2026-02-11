import { assert } from 'vitest';
import { root, key, value } from './__mocks__';

describe('@biorate/config-loader', function () {
  beforeAll(async () => await root.$run());

  it('config-loader-test', () => assert.equal(root.config.get(key), value));
});
