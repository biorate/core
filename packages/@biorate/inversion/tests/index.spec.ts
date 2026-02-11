import { assert } from 'vitest';
import * as mocks from './__mocks__/';

describe('@biorate/inversion', () => {
  describe('@init()', () => {
    it('simple', () => new Promise((done) => mocks.initialize(done).$run()));

    it('override simple (child)', () =>
      new Promise((done) => mocks.override.simple.child(done).$run()));

    it('override simple (parent)', () =>
      new Promise((done) => mocks.override.simple.parent(done).$run()));

    it('override undeclared (child)', () =>
      new Promise((done) => mocks.override.undeclared.child(done).$run()));

    it('override undeclared (parent)', () =>
      new Promise((done) => mocks.override.undeclared.parent(done).$run()));

    it('override triple', () =>
      new Promise((done) => mocks.override.triple(done).$run()));

    it('inherits dual (child)', async () =>
      assert.deepEqual(...(await mocks.inherits.dual.child())));

    it('inherits dual (parent)', async () =>
      assert.deepEqual(...(await mocks.inherits.dual.parent())));

    it('composition', async () => {
      const [root, result, One, Two, Three, Multi, Multi1, Mult2] =
        await mocks.composition();
      assert.deepEqual(result, [One.name, Two.name, Three.name]);
      assert(root.one instanceof One);
      assert(root.two instanceof Two);
      assert(root.three instanceof Three);
      assert(root.multi[0] instanceof Multi);
      assert(root.multi[1] instanceof Multi);
      assert(root.multi[0] instanceof Multi1);
      assert(root.multi[1] instanceof Mult2);
    });

    it('multiinit', async () => assert.deepEqual(...(await mocks.multiinit())));
  });

  describe('@on(event: string)', () => {
    it('simple', () => new Promise((done) => mocks.events.simple(done)));

    it('override (child)', () =>
      new Promise((done) => mocks.events.override.child(done)));

    it('override (parent)', () =>
      new Promise((done) => mocks.events.override.parent(done)));

    it('undeclared (child)', () =>
      new Promise((done) => mocks.events.undeclared.child(done)));

    it('undeclared (parent)', () =>
      new Promise((done) => mocks.events.undeclared.parent(done)));
  });
});
