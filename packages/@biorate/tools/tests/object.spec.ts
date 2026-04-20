import { assert } from 'vitest';
import { object } from '../src';
import {
  One,
  Two,
  Three,
  unsorted,
  sortedKeys,
  accessorGet,
  accessorSet,
} from './__mocks__/object';

describe('object', () => {
  it('walkProto', () => {
    let names = [Three.name, Two.name, One.name],
      total = names.length,
      count = 0;
    object.walkProto(new Three(), (object) => {
      names.splice(names.indexOf(object.constructor.name), 1);
      ++count;
    });
    assert(count === total);
    assert(names.length === 0);
  });

  it('kSort', () => {
    assert.deepEqual(Object.keys(object.kSort(unsorted)), sortedKeys);
  });

  it('isAccessor', () => {
    assert(object.isAccessor(accessorGet, 'a'));
    assert(object.isAccessor(accessorSet, 'a'));
  });
});
