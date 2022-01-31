import { EventEmitter } from 'events';
import { lifecycled, on } from '../../src';

export function simpleEvents(done) {
  const event = 'test';
  class One extends EventEmitter {
    @on(event) public test() {
      done();
    }
  }
  const obj = new One();
  lifecycled(obj).then(() => obj.emit(event));
}
