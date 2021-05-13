import { assert } from 'chai';
import { Test } from './__mocks__';

describe('Symbols factory', () => {
  it('property should be symbol', () => {
    assert(typeof Test.test === 'symbol');
  });
});
