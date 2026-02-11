import { assert } from 'vitest';
import { list, items } from './__mocks__/simple.indexed.list';

describe('Simple indexed list', () => {
  it('get', () => {
    assert.equal(list.get(0)[0], items[0]);
    assert.equal(list.get(1)[0], items[1]);
    assert.equal(list.get(2)[0], items[2]);
  });

  it('find', () => {
    assert.equal(list.find(0), items[0]);
    assert.equal(list.find(1), items[1]);
    assert.equal(list.find(2), items[2]);
  });

  it('has', () => {
    assert(list.has(0));
    assert(list.has(1));
    assert(list.has(2));
  });

  it('set', () => {
    const item = { a: 2 };
    list.set(item);
    assert.equal(list.find(3), item);
  });

  it('delete pop', () => {
    list.delete(3);
    assert(list.size === items.length);
    assert(!list.find(3));
  });

  it('delete shift', () => {
    list.delete(0);
    assert(list.find(0));
  });
});
