import { assert } from 'vitest';
import { env } from '../src';

describe('env', () => {
  it('isServer', () => assert.isBoolean(env.isServer));
});
