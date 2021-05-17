import { assert } from 'chai';
import { Item, Nested, Binded, data } from './__mocks__/item.embed.props';

describe('Item embed props', () => {
  it('initialize', () => {
    const item = new Item().initialize(data);
    assert.equal(item.int, data.int);
    assert.equal(item.float, data.float);
    assert.equal(item.string, data.string);
    assert.equal(item.bool, data.bool);
    assert.deepEqual(item.date, data.date);
    assert.deepEqual(item.luxon.toJSDate(), data.luxon);
    assert.deepEqual(item.object, data.object);
    assert.deepEqual(item.array, data.array);
    assert.deepEqual(item.json, JSON.parse(data.json));
    assert(item.nested instanceof Nested);
    assert(item.nested.map.get(1) === 'a');
    assert(item.nested.map.get(2) === 'b');
    assert(item.nested.set.has(1));
    assert(item.nested.set.has(2));
    assert(item.nested.binded instanceof Binded);
    assert(item.injectable === item.nested.injectable);
  });
});
