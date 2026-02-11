import { assert } from 'vitest';
import { Item, list, items } from './__mocks__/factory.list';

describe('Factory list', () => {
  it('find', () => {
    assert(list.find(1) instanceof Item);
    assert(list.find(2) instanceof Item);
    assert.equal(list.find(1).a, items[0].a);
    assert.equal(list.find(2).a, items[1].a);
  });
});
