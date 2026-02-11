import { assert } from 'vitest';
import { time } from '../src';

describe('time', () => {
  it('diff', () => assert.isNumber(time.diff()()));

  it('msTo', () => {
    const value = 1740576755703;
    assert.deepEqual(time.msTo(value), value);
    assert.deepEqual(time.msTo(value, 'µs'), value * 1000);
    assert.deepEqual(time.msTo(value, 'ms'), value);
    assert.deepEqual(time.msTo(value, 's'), value / 1000);
    assert.deepEqual(time.msTo(value, 'm'), value / 1000 / 60);
    assert.deepEqual(time.msTo(value, 'h'), value / 1000 / 60 / 60);
    assert.deepEqual(time.msTo(value, 'd'), value / 1000 / 60 / 60 / 24);
  });
});
