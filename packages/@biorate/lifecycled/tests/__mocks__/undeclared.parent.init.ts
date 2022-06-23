import { Done } from 'mocha';
import { lifecycled, init } from '../../src';

export function initUndeclaredParent(done: Done) {
  class One {
    public initialize() {
      throw new Error('[initialize] called undeclared');
    }
  }

  class Two extends One {
    @init() public initialize() {
      done();
    }
  }

  return lifecycled(new Two());
}
