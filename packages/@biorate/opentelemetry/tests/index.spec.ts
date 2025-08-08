import { setTimeout } from 'timers/promises';
import { Test } from './__mocks__';

describe('@biorate/opentelemetry', function () {
  this.timeout(10000);

  it('span', async () => {
    const test = new Test();
    test.test1(1, 2);
    test.test2(3, 4);
    try {
      test.test3(5, 6);
    } catch {}
    await setTimeout(1000);
  });

  it('async span', async () => {
    const test = new Test();
    await test.test5(1);
  });

  it('masking', async () => {
    const test = new Test();
    test.test4('in@mail.com');
  });
});
