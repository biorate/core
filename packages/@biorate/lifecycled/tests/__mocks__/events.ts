import { EventEmitter } from 'events';
import { lifecycled, on } from '../../src';

export const events = {
  simple(done) {
    const event = 'test';
    class One extends EventEmitter {
      @on(event) public test() {
        done();
      }
    }

    const obj = new One();
    lifecycled(obj).then(() => obj.emit(event));
  },

  override: {
    child(done) {
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
    },

    parent(done) {
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
    },
  },

  undeclared: {
    child(done) {
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
      const obj = new One();
      lifecycled(obj).then(() => obj.emit(event));
    },

    parent(done) {
      const event = 'test';
      class One extends EventEmitter {
        @on(event) test() {
          done(new Error('[test] event received twice'));
        }
      }
      class Two extends One {
        test() {
          done();
        }
      }
      const obj = new Two();
      lifecycled(obj).then(() => obj.emit(event));
    },
  },
};
