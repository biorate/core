import { assert } from 'chai';
import * as mocks from './__mocks__/';

describe('@biorate/inversion', function () {
  describe('@init()', function () {
    it('simple', (done) => mocks.initialize(done).$run());

    it('override simple (child)', (done) => mocks.override.simple.child(done).$run());

    it('override simple (parent)', (done) => mocks.override.simple.parent(done).$run());

    it('override undeclared (child)', (done) =>
      mocks.override.undeclared.child(done).$run());

    it('override undeclared (parent)', (done) =>
      mocks.override.undeclared.parent(done).$run());

    it('override triple', (done) => mocks.override.triple(done).$run());

    it('inherits dual (child)', async () =>
      assert.deepEqual(...(await mocks.inherits.dual.child())));

    it('inherits dual (parent)', async () =>
      assert.deepEqual(...(await mocks.inherits.dual.parent())));

    it('composition', async () => {
      const [root, result, One, Two, Three] = await mocks.composition();
      assert.deepEqual(result, [One.name, Two.name, Three.name]);
      assert(root.one instanceof One);
      assert(root.two instanceof Two);
      assert(root.three instanceof Three);
    });

    it('multiinit', async () => assert.deepEqual(...(await mocks.multiinit())));
  });

  describe('@on(event: string)', function () {
    it('simple', (done) => mocks.events.simple(done));

    it('override (child)', (done) => mocks.events.override.child(done));

    it('override (parent)', (done) => mocks.events.override.parent(done));

    it('undeclared (child)', (done) => mocks.events.undeclared.child(done));

    it('undeclared (parent)', (done) => mocks.events.undeclared.parent(done));
  });
});
