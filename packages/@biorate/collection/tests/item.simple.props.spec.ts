import { assert } from 'chai';
import { Item, Nested, Binded, data } from './__mocks__/item.simple.props';

describe('Item simple props', () => {
  it('initialize', () => {
    const item = new Item().initialize(data);
    /* @ts-ignore */
    assert.equal(item.int, data.int);
    /* @ts-ignore */
    assert.equal(item.float, data.float);
    /* @ts-ignore */
    assert.equal(item.string, data.string);
    /* @ts-ignore */
    assert.equal(item.bool, data.bool);
    /* @ts-ignore */
    assert.deepEqual(item.date, data.date);
    /* @ts-ignore */
    assert.deepEqual(item.luxon.toJSDate(), data.luxon);
    /* @ts-ignore */
    assert.deepEqual(item.array, data.array);
    /* @ts-ignore */
    assert.deepEqual(item.object, data.object);
    /* @ts-ignore */
    assert.deepEqual(item.json, JSON.parse(data.json));
    /* @ts-ignore */
    assert(item.nested instanceof Nested);
    /* @ts-ignore */
    assert(item.nested.map.get(1) === 'a');
    /* @ts-ignore */
    assert(item.nested.map.get(2) === 'b');
    /* @ts-ignore */
    assert(item.nested.set.has(1));
    /* @ts-ignore */
    assert(item.nested.set.has(2));
    /* @ts-ignore */
    assert(item.nested.binded instanceof Binded);
  });
});
