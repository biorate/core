import { lifecycled, init, kill } from '../../src';

export function initOverrideParent(done) {
  class Uno {
    @init() public initialize() {
      done();
    }
  }

  class Dos extends Uno {
    @init() public initialize() {
      done(new Error('[initialize] called twice'));
    }
  }

  return lifecycled(new Uno());
}
