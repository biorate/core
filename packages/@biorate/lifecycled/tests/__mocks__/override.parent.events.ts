import { EventEmitter } from 'events';
import { Done } from 'mocha';
import { lifecycled, on } from '../../src';

export function overrideParentEvents(done: Done) {
  const event = 'test';
  class One extends EventEmitter {
    @on(event) test() {
      done();
    }
  }
  class Two extends One {
    @on(event) test() {
      done(new Error('[test] event received twice'));
    }
  }
  const obj = new One();
  lifecycled(obj).then(() => obj.emit(event));
}
