import { lifecycled, init, kill } from '../../src';

export function initOverrideChild(done) {
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
