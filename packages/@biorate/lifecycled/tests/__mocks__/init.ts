import { lifecycled, init } from '../../src';
import { Done } from 'mocha';

export function initialize(done: Done) {
  class Uno {
    @init() public initialize() {
      done();
    }
  }
  return lifecycled(new Uno());
}
