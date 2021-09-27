import { assert } from 'chai';
import { EventEmitter } from 'events';
import { events } from '../src';

describe('events', () => {
  it('once', async () => {
    const data = [1, 2, 3];
    const object = new EventEmitter();
    const promise = events.once(object, 'test');
    object.emit('test', ...data);
    const result = await promise;
    assert.deepEqual(result, data);
  });
});
