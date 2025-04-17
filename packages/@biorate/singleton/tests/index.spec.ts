import { assert } from 'chai';
import { Singleton } from '../src';

describe('Singleton', () => {
  it('get instance', () => {
    class Test extends Singleton {
      public static get() {
        return this.instance<Test>();
      }
    }
    assert(Test.get() === Test.get());
  });
});
