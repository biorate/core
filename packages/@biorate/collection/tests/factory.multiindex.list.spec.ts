import { assert } from 'vitest';
import { listAB, itemsAB, listABBC, ItemAB, ItemABBC } from './__mocks__/factory.multiindex.list';

describe('Factory multiindex list', () => {
  it('listAB', () => {
    for (const item of itemsAB) assert(listAB.get(item.a, item.b));
    assert(listAB.find(itemsAB[0].a, itemsAB[0].b) instanceof ItemAB);
    assert(listAB.has(itemsAB[0].a, itemsAB[0].b));
  });

  it('listABBC', () => {
    assert(listABBC.get('1', '2').length === 2);
    assert(listABBC.get('2', '1').length === 2);
    assert(listABBC.get('3', '1').length === 1);
    assert(listABBC.get('1', '4').length === 1);
    assert(listABBC.get('1', '2', '1').length === 1);
    assert(listABBC.get('4', '1', '4').length === 1);
    assert(listABBC.find('4', '1', '4') instanceof ItemABBC);
    assert(listABBC.has('4', '1', '4'));
  });
});
