import { assert } from 'vitest';
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
    assert(item.nested.itemSet.has(1));
    assert(item.nested.itemSet.has(2));
    assert(item.nested.binded instanceof Binded);
    assert(item.binded === item.nested.binded);
  });

  it('set', () => {
    const item = new Item().initialize(data);
    assert.equal(item.int, data.int);
    assert.equal(item.float, data.float);
    assert.equal(item.string, data.string);
    const int = data.int + 1;
    const float = data.float + 1;
    const string = data.string + ' World!';
    item.set({ int, float, string });
    assert.equal(item.int, int);
    assert.equal(item.float, float);
    assert.equal(item.string, string);
  });
});
