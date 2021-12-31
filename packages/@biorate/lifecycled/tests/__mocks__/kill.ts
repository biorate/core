import { lifecycled, kill } from '../../src';

export function destruct(done) {
  class Uno {
    @kill() public destructor() {
      done();
    }
  }
  return lifecycled(new Uno());
}
