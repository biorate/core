import {
  initialize,
  initOverrideChild,
  initOverrideParent,
  destruct,
  events,
} from './__mocks__';

describe('Lifecycled', () => {
  describe('@init()', function () {
    it('simple', initialize);
    it('override child', initOverrideChild);
    it('override parent', initOverrideParent);
  });

  describe('@on(event: string)', function () {
    it('simple', (done) => events.simple(done));

    it('override (child)', (done) => events.override.child(done));

    it('override (parent)', (done) => events.override.parent(done));

    it('undeclared (child)', (done) => events.undeclared.child(done));

    it('undeclared (parent)', (done) => events.undeclared.parent(done));
  });

  describe('@kill()', function () {
    it('simple', (done) => {
      destruct(done);
      process.exit();
    });
  });
});
