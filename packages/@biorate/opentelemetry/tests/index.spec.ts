import { setTimeout } from 'timers/promises';
import { Test } from './__mocks__';

describe('@biorate/opentelemetry', function () {
  this.timeout(10000);

  it('test', async () => {
    const test = new Test();
    test.test1(1, 2);
    test.test2(3, 4);
    try {
      test.test3(5, 6);
    } catch {}
    await setTimeout(5000);
  });
});
