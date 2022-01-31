import {
  initialize,
  initOverrideChild,
  initOverrideParent,
  initUndeclaredChild,
  initUndeclaredParent,
  simpleEvents,
  overrideChildEvents,
  overrideParentEvents,
  undeclaredChildEvents,
  undeclaredParentEvents,
  destruct,
} from './__mocks__';

describe('Lifecycled', () => {
  describe('@init()', function () {
    it('simple', initialize);
    it('override child', initOverrideChild);
    it('override parent', initOverrideParent);
    it('undeclared child', initUndeclaredChild);
    it('undeclared parent', initUndeclaredParent);
  });

  describe('@on(event: string)', function () {
    it('simple', simpleEvents);
    it('override (child)', overrideChildEvents);
    it('override (parent)', overrideParentEvents);
    it('undeclared (child)', undeclaredChildEvents);
    it('undeclared (parent)', undeclaredParentEvents);
  });

  describe('@kill()', function () {
    it('simple', (done) => {
      destruct(done);
      process.exit();
    });
  });
});
