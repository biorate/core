import { lifecycled, init } from '../../src';

export function initialize(done) {
  @lifecycled()
  class Uno {
    @init() public initialize() {
      done();
    }
  }
  return new Uno();
}
