import { assert } from 'vitest';
import { Test } from './__mocks__';
import { Global } from '../src';

describe('Symbols factory', () => {
  it('registry property should be symbol', () => {
    assert(typeof Test.test === 'symbol');
  });

  it('global property should be symbol', () => {
    assert(typeof Global.test === 'symbol');
  });

  it('global property namespace check', () => {
    assert(Global('test1').test !== Global('test2').test);
    assert(Global('test1').test === Global('test1').test);
    assert(Global('test2').test === Global('test2').test);
    assert(Global('test2').test1 !== Global('test2').test2);
  });
});
