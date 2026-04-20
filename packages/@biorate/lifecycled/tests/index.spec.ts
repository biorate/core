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
  initRegexpBug,
  destruct,
  p,
} from './__mocks__';

describe('Lifecycled', () => {
  describe('@init()', function () {
    it('simple', p(initialize));
    it('override child', p(initOverrideChild));
    it('override parent', p(initOverrideParent));
    it('undeclared child', p(initUndeclaredChild));
    it('undeclared parent', p(initUndeclaredParent));
  });

  describe('@on(event: string)', function () {
    it('simple', p(simpleEvents));
    it('override (child)', p(overrideChildEvents));
    it('override (parent)', p(overrideParentEvents));
    it('undeclared (child)', p(undeclaredChildEvents));
    it('undeclared (parent)', p(undeclaredParentEvents));
  });

  describe('bug-fix', function () {
    it('RegExp bug fix', p(initRegexpBug));
  });

  describe('@kill()', function () {
    it(
      'simple',
      p((done) => {
        destruct(done);
        process.kill(process.pid, 'SIGINT');
      }),
    );
  });
});
