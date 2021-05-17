import { assert } from 'chai';
import { list, items } from './__mocks__/simple.list';

describe('Simple list', () => {
  it('get', () => {
    assert.equal(list.get(1)[0], items[0]);
    assert.equal(list.get(2)[0], items[1]);
  });

  it('find', () => {
    assert.equal(list.find(1), items[0]);
    assert.equal(list.find(2), items[1]);
  });

  it('has', () => {
    assert(list.has(1));
    assert(list.has(2));
  });

  it('set', () => {
    const item = { id: 3 };
    list.set(item);
    assert.equal(list.find(3), item);
  });

  it('delete', () => {
    list.delete(3);
    assert(list.size === items.length);
    assert(!list.find(3));
  });

  it('getBy', () => {
    const items = [{ id: 3, field: 'test' }, { id: 4, field: 'test' }];
    list.set(...items);
    let result = list.getBy({ field: 'test' });
    assert.equal(result.length, items.length);
    for (let i = items.length; i--;)
      assert.equal(result[i], items[i]);
    result = list.getBy({ id: 3, field: 'test' });
    assert.equal(result.length, 1);
    assert.equal(result[0], items[0]);
  });

  it('clear', () => {
    list.clear();
    assert(!list.size);
  });
});
