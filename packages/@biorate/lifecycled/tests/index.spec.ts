import { initialize, initOverrideChild, initOverrideParent, destruct } from './__mocks__';

describe('Lifecycled', () => {
  describe('@init()', function () {
    it('simple', initialize);
    it('override child', initOverrideChild);
    it('override parent', initOverrideParent);
  });

  describe('@kill()', function () {
    it('simple', (done) => {
      destruct(done);
      process.exit();
    });
  });
});
