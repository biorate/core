import { assert } from 'chai';
import { time } from '../src';

describe('time', () => {
  it('diff', () => assert.isNumber(time.diff()()));
});
