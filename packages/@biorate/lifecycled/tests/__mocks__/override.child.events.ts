import { EventEmitter } from 'events';
import { Done } from 'mocha';
import { lifecycled, on } from '../../src';

export function overrideChildEvents(done: Done) {
  const event = 'test';
  class One extends EventEmitter {
    @on(event) test() {
      done(new Error('[test] event received twice'));
    }
  }
  class Two extends One {
    @on(event) test() {
      done();
    }
  }
  const obj = new Two();
  lifecycled(obj).then(() => obj.emit(event));
}
