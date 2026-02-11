import { EventEmitter } from 'events';
import { Done } from './done';
import { lifecycled, on } from '../../src';

export function undeclaredParentEvents(done: Done) {
  const event = 'test';
  class One extends EventEmitter {
    @on(event) test() {
      done();
    }
  }
  class Two extends One {
    test() {
      done(new Error('[test] event received twice'));
    }
  }
  const obj = new Two();
  lifecycled(obj).then(() => obj.emit(event));
}
