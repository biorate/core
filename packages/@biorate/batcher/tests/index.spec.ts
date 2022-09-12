import { expect } from 'chai';
import { root } from './__mocks__';

describe('@biorate/batcher', function () {
  this.timeout(30000);

  before(async () => {
    await root.$run();
  });

  after(() => {
    process.exit(0);
  });

  it('register / add', (done) => {
    root.batcher.register((tasks) => {
      expect(tasks).toMatchSnapshot();
      done();
    });
    root.batcher.add({ data: 'one' }, { test: 'one' });
    root.batcher.add({ data: 'two' }, { test: 'two' });
    root.batcher.add({ data: 'three' }, { test: 'three' });
  });
});
