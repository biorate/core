import { AsyncLoop } from '../src';

describe('@biorate/async-loop', () => {
  it('run', () =>
    new Promise((done) => {
      const loop = new AsyncLoop(() => {
        loop.stop();
        done(void 0);
      });
    }));
});
