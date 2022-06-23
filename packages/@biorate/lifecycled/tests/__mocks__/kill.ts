import { lifecycled, kill } from '../../src';
import { Done } from 'mocha';

export function destruct(done: Done) {
  class Uno {
    @kill() public destructor() {
      done();
    }
  }
  return lifecycled(new Uno());
}
