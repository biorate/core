import { assert } from 'vitest';
import { ObservableTypes } from '../src';
import { create, item } from './__mocks__/observable.list';

describe('Observable list', () => {
  it('set', () =>
    new Promise((done) => {
      create((data) => {
        assert.equal(data.type, ObservableTypes.add);
        assert.deepEqual(data.newValue, item);
        done();
      }).set(item);
    }));

  it('delete', () =>
    new Promise((done) => {
      create(
        (data) => {
          assert.equal(data.type, ObservableTypes.delete);
          assert.deepEqual(data.oldValue, item);
          done();
        },
        [item],
      ).delete(1);
    }));
});
