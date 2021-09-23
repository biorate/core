import { assert } from 'chai';
import * as init from './__mocks__/init';
// import { Core, init, inject, injectable, container, log } from '../src';

describe('@biorate/inversion', () => {
  describe('init', () => {
    it('simple', (done) => init.simple(done).$run());

    it('override (child)', (done) => init.override.child(done).$run());

    it('override (parent)', (done) => init.override.parent(done).$run());

    // it('in parent (Child create)', (done) => {
    //   class One extends Core() {
    //     @init() initialize() {
    //       done();
    //     }
    //   }
    //   class Two extends One {
    //     initialize() {}
    //   }
    //   const obj = new Two();
    //   obj.$run();
    // });
    //
    // it('in parent (Parent create)', (done) => {
    //   class One extends Core() {
    //     @init() initialize() {
    //       done();
    //     }
    //   }
    //   class Two extends One {
    //     initialize() {}
    //   }
    //   const obj = new One();
    //   obj.$run();
    // });

    // it('Triple override', (done) => {
    //   class One extends Core() {
    //     @init() initialize() {
    //       done(new Error('[initialize] called twice'));
    //     }
    //   }
    //   class Two extends One {
    //     @init() initialize() {
    //       done(new Error('[initialize] called twice'));
    //     }
    //   }
    //   class Three extends Two {
    //     @init() initialize() {
    //       done();
    //     }
    //   }
    //   const obj = new Three();
    //   obj.$run();
    // });

    // it('Dual inherits (Child create)', async () => {
    //   const result = [];
    //   class One extends Core() {
    //     @init() initialize() {
    //       result.push(One.name);
    //     }
    //   }
    //   class Two1 extends One {
    //     @init() initialize() {
    //       result.push(Two1.name);
    //     }
    //   }
    //   class Two2 extends One {
    //     @init() initialize() {
    //       result.push(Two2.name);
    //     }
    //   }
    //   const two1 = new Two1();
    //   const two2 = new Two2();
    //   await two1.$run();
    //   await two2.$run();
    //   assert.deepEqual(result, [Two1.name, Two2.name]);
    // });

    // it('Dual inherits (Parent create)', async () => {
    //   const result = [];
    //   class One extends Core() {
    //     @init() initialize() {
    //       result.push(One.name);
    //     }
    //   }
    //   class Two1 extends One {
    //     @init() initialize() {
    //       result.push(Two1.name);
    //     }
    //   }
    //   class Two2 extends One {
    //     @init() initialize() {
    //       result.push(Two2.name);
    //     }
    //   }
    //   const one = new One();
    //   await one.$run();
    //   assert.deepEqual(result, [One.name]);
    // });

    // it('Composition simple', async () => {
    //   const result = [];
    //   @injectable()
    //   class One {
    //     @init() initialize() {
    //       result.push(this.constructor.name);
    //     }
    //   }
    //   @injectable()
    //   class Two {
    //     @init() initialize() {
    //       result.push(this.constructor.name);
    //     }
    //   }
    //   @injectable()
    //   class Three {
    //     @init() initialize() {
    //       result.push(this.constructor.name);
    //     }
    //   }
    //   class Root extends Core() {
    //     @inject(One) one;
    //     @inject(Two) two;
    //     @inject(Three) three;
    //   }
    //   container.bind(One).toSelf();
    //   container.bind(Two).toSelf();
    //   container.bind(Three).toSelf();
    //   container.bind(Root).toSelf();
    //   const root = await container.get(Root).$run();
    //   assert.deepEqual(result, [One.name, Two.name, Three.name]);
    //   assert(root.one instanceof One);
    //   assert(root.two instanceof Two);
    //   assert(root.three instanceof Three);
    // });

    // it('Different method names (2 items)', async () => {
    //   const result = [];
    //   class One extends Core() {
    //     @init() one() {
    //       result.push(this.one.name);
    //     }
    //   }
    //   class Two extends One {
    //     @init() two() {
    //       result.push(this.two.name);
    //     }
    //   }
    //   const obj = new Two();
    //   await obj.$run();
    //   assert.deepEqual(result, [Two.prototype.two.name, One.prototype.one.name]);
    // });

    //   it('Different method names (3 items)', async () => {
    //     const result = [];
    //     class One extends Core() {
    //       @init() one() {
    //         result.push(this.one.name);
    //       }
    //     }
    //     class Two extends One {
    //       @init() two() {
    //         result.push(this.two.name);
    //       }
    //     }
    //     class Three extends Two {
    //       @init() three() {
    //         result.push(this.three.name);
    //       }
    //     }
    //     const obj = new Three();
    //     await obj.$run();
    //     assert.deepEqual(result, [
    //       Three.prototype.three.name,
    //       Two.prototype.two.name,
    //       One.prototype.one.name,
    //     ]);
    //   });
    // });
  });
});
