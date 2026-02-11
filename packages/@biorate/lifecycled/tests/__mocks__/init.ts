import { lifecycled, init } from '../../src';
import { Done } from './done';

export function initialize(done: Done) {
  class Uno {
    @init() public initialize() {
      done();
    }
  }
  return lifecycled(new Uno());
}
