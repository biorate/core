import { assert } from 'vitest';
import { ObservableTypes } from '../src';
import { create } from './__mocks__/observable.item';

describe('Observable item', () => {
  it('update', () =>
    new Promise((done) => {
      const item = create((data) => {
        assert.equal(data.type, ObservableTypes.update);
        assert.equal(data.newValue, newValue);
        assert.equal(data.oldValue, oldValue);
        assert.equal(data.name, name);
        done();
      });
      const oldValue = item.int;
      const newValue = 2;
      const name = 'int';
      item[name] = newValue;
    }));

  it('update nested', () =>
    new Promise((done) => {
      const item = create((data) => {
        assert.equal(data.type, ObservableTypes.add);
        assert.equal(data.newValue, newValue);
        done(void 0);
      });
      const newValue = 4;
      const name = 'itemSet';
      item.nested[name].add(newValue);
    }));
});
