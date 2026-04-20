import { assert } from 'vitest';
import { ObservableTypes } from '../src';
import { create } from './__mocks__/observable.collection';

describe('Observable collection', () => {
  it('update', () =>
    new Promise((done) => {
      const oldValue = 'test';
      const newValue = 'test2';
      const name = 'string';
      const list = create(
        (data) => {
          assert.equal(data.type, ObservableTypes.update);
          assert.deepEqual(data.newValue, newValue);
          assert.deepEqual(data.oldValue, oldValue);
          assert.deepEqual(data.name, name);
          done(void 0);
        },
        [{ id: 1, [name]: oldValue }],
      );
      list.find(1)[name] = newValue;
    }));
});
