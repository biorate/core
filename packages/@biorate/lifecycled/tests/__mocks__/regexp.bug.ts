import { Done } from 'mocha';
import { lifecycled, init } from '../../src';

export function initRegexpBug(done: Done) {
  class RegexpBug {
    public regexp = /test/;

    @init() public initialize() {
      done(
        Reflect.getOwnMetadataKeys(this.regexp).length
          ? new Error('Metadata was defined in RegExp type')
          : undefined,
      );
    }
  }

  return lifecycled(new RegexpBug());
}
