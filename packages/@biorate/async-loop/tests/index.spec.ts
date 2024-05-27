import { AsyncLoop } from '../src';

describe('@biorate/async-loop', function () {
  this.timeout(Infinity);

  it('run', (done) => {
    const loop = new AsyncLoop(() => {
      loop.stop();
      done();
    });
  });
});
