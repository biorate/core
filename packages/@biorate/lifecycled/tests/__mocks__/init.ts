import { lifecycled, init } from '../../src';

export function initialize(done) {
  class Uno {
    @init() public initialize() {
      done();
    }
  }
  return lifecycled(new Uno());
}
