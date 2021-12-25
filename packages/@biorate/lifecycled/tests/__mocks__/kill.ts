import { lifecycled, kill } from '../../src';

export function destruct(done) {
  @lifecycled()
  class Uno {
    @kill() public destructor() {
      done();
    }
  }
  return new Uno();
}
