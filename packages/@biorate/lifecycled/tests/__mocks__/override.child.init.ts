import { Done } from 'mocha';
import { lifecycled, init } from '../../src';

export function initOverrideChild(done: Done) {
  class Uno {
    @init() public initialize() {
      done(new Error('[initialize] called twice'));
    }
  }

  class Dos extends Uno {
    @init() public initialize() {
      done();
    }
  }

  return lifecycled(new Dos());
}
