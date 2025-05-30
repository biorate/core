import { EventEmitter } from 'events';
import { Done } from 'mocha';
import { Core, init, injectable, inject, container, on, kill, Types } from '../../src';

// @ts-ignore
Core.log = null;

export function initialize(done: Done) {
  class One extends Core() {
    @init() public initialize() {
      done();
    }
  }
  return new One();
}

export const override = {
  simple: {
    child(done: Done) {
      class One extends Core() {
        @init() public initialize() {
          done(new Error('[initialize] called twice'));
        }
      }

      class Two extends One {
        @init() public initialize() {
          done();
        }
      }

      return new Two();
    },

    parent(done: Done) {
      class One extends Core() {
        @init() public initialize() {
          done();
        }
      }

      class Two extends One {
        @init() public initialize() {
          done(new Error('[initialize] called twice'));
        }
      }

      return new One();
    },
  },

  undeclared: {
    child(done: Done) {
      class One extends Core() {
        @init() public initialize() {
          done();
        }
      }

      class Two extends One {
        public initialize() {
          throw new Error('[initialize] called undeclared');
        }
      }

      return new Two();
    },

    parent(done: Done) {
      class One extends Core() {
        public initialize() {
          throw new Error('[initialize] called undeclared');
        }
      }

      class Two extends One {
        @init() public initialize() {
          done();
        }
      }

      return new Two();
    },
  },

  triple(done: Done) {
    class One extends Core() {
      @init() public initialize() {
        done(new Error('[initialize] called twice'));
      }
    }
    class Two extends One {
      @init() public initialize() {
        done(new Error('[initialize] called twice'));
      }
    }
    class Three extends Two {
      @init() public initialize() {
        done();
      }
    }
    return new Three();
  },
};

export const inherits = {
  dual: {
    async child(): Promise<[string[], string[]]> {
      const result: string[] = [];
      class One extends Core() {
        @init() public initialize() {
          result.push(One.name);
        }
      }
      class Two1 extends One {
        @init() public initialize() {
          result.push(Two1.name);
        }
      }
      class Two2 extends One {
        @init() public initialize() {
          result.push(Two2.name);
        }
      }
      const two1 = new Two1();
      const two2 = new Two2();
      await Promise.all([two1.$run(), two2.$run()]);
      return [result, [Two1.name, Two2.name]];
    },

    async parent(): Promise<[string[], string[]]> {
      const result: string[] = [];
      class One extends Core() {
        @init() public initialize() {
          result.push(One.name);
        }
      }
      class Two1 extends One {
        @init() public initialize() {
          result.push(Two1.name);
        }
      }
      class Two2 extends One {
        @init() public initialize() {
          result.push(Two2.name);
        }
      }
      const one = new One();
      await one.$run();
      return [result, [One.name]];
    },
  },
};

export async function composition() {
  const result: string[] = [];
  @injectable()
  class One {
    @init() public initialize() {
      result.push(this.constructor.name);
    }
  }
  @injectable()
  class Two {
    @init() public initialize() {
      result.push(this.constructor.name);
    }
  }
  @injectable()
  class Three {
    @init() public initialize() {
      result.push(this.constructor.name);
    }
  }
  @injectable()
  class Multi {}
  @injectable()
  class Multi1 extends Multi {}
  @injectable()
  class Multi2 extends Multi {}
  class Root extends Core() {
    @inject(One) public one: One;
    @inject(Two) public two: Two;
    @inject(Three) public three: Three;
    @inject.multi(Types.Multi) public multi: Multi[];
  }
  container.bind(One).toSelf();
  container.bind(Two).toSelf();
  container.bind(Three).toSelf();
  container.bind(Root).toSelf();
  container.bind(Types.Multi).to(Multi1);
  container.bind(Types.Multi).to(Multi2);
  return [
    await container.get(Root).$run(),
    result,
    One,
    Two,
    Three,
    Multi,
    Multi1,
    Multi2,
  ];
}

export async function multiinit(): Promise<[string[], string[]]> {
  const result: string[] = [];
  class One extends Core() {
    @init() public one() {
      result.push(this.one.name);
    }
  }
  class Two extends One {
    @init() public two() {
      result.push(this.two.name);
    }
  }
  class Three extends Two {
    @init() public three() {
      result.push(this.three.name);
    }
  }
  const obj = new Three();
  await obj.$run();
  return [
    result,
    [Three.prototype.three.name, Two.prototype.two.name, One.prototype.one.name],
  ];
}

export const events = {
  simple(done: Done) {
    const event = 'test';
    class One extends Core(EventEmitter) {
      @on(event) public test() {
        done();
      }
    }
    const obj = new One();
    obj.$run().then(() => obj.emit(event));
  },

  override: {
    child(done: Done) {
      const event = 'test';
      class One extends Core(EventEmitter) {
        @on(event) test() {
          done(new Error('[test] event received twice'));
        }
      }
      class Two extends One {
        @on(event) test() {
          done();
        }
      }
      const obj = new Two();
      obj.$run().then(() => obj.emit(event));
    },

    parent(done: Done) {
      const event = 'test';
      class One extends Core(EventEmitter) {
        @on(event) test() {
          done();
        }
      }
      class Two extends One {
        @on(event) test() {
          done(new Error('[test] event received twice'));
        }
      }
      const obj = new One();
      obj.$run().then(() => obj.emit(event));
    },
  },

  undeclared: {
    child(done: Done) {
      const event = 'test';
      class One extends Core(EventEmitter) {
        @on(event) test() {
          done();
        }
      }
      class Two extends One {
        test() {
          done(new Error('[test] event received twice'));
        }
      }
      const obj = new One();
      obj.$run().then(() => obj.emit(event));
    },

    parent(done: Done) {
      const event = 'test';
      class One extends Core(EventEmitter) {
        @on(event) test() {
          done();
        }
      }
      class Two extends One {
        test() {
          done(new Error('[test] event received twice'));
        }
      }
      const obj = new Two();
      obj.$run().then(() => obj.emit(event));
    },
  },
};
