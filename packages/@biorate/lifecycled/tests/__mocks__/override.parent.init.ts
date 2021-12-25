import { lifecycled, init, kill } from '../../src';

export function initOverrideParent(done) {
  @lifecycled()
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

  return new Uno();
}
