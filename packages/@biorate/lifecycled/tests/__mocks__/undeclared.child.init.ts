import { Done } from 'mocha';
import { lifecycled, init } from '../../src';

export function initUndeclaredChild(done: Done) {
  class One {
    @init() public initialize() {
      done();
    }
  }

  class Two extends One {
    public initialize() {
      throw new Error('[initialize] called undeclared');
    }
  }

  return lifecycled(new Two());
}
