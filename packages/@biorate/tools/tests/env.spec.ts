import { assert } from 'chai';
import { env } from '../src';

describe('env', () => {
  it('isServer', () => assert.isBoolean(env.isServer));
});
