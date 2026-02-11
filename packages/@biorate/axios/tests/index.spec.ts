import { expect } from 'vitest';
import { Yandex } from './__mocks__';
import { AxiosError } from '../src';

describe('@biorate/axios', () => {
  it('fetch', async () => expect((await Yandex.fetch()).status).to.be.equal(200));

  it('catch', () =>
    new Promise((done) => {
      class Catch extends Yandex {
        protected async catch() {
          expect('catch').toMatchSnapshot();
          done(void 0);
        }
      }
      Catch.fetch({ baseURL: 'http://undefined' }).catch(() => {});
    }));

  it('finally', async () =>
    new Promise((done) => {
      class Finally extends Yandex {
        protected async finally() {
          expect('finally').toMatchSnapshot();
          done(void 0);
        }
      }
      Finally.fetch({ baseURL: 'http://undefined' }).catch(() => {});
    }));

  it('mocks', async () => {
    const options = {};
    const key = JSON.stringify(options);
    class Mocks1 extends Yandex {}
    class Mocks2 extends Yandex {}
    Mocks1.useMock();
    Mocks2.useMock();
    expect(Mocks1.store?.[Mocks1.name]?.[key]).to.be.undefined;
    expect(Mocks2.store?.[Mocks2.name]?.[key]).to.be.undefined;
    await Mocks1.fetch(options);
    await Mocks2.fetch(options);
    expect(Mocks1.store?.[Mocks1.name]?.[key]).to.not.be.undefined;
    expect(Mocks2.store?.[Mocks2.name]?.[key]).to.not.be.undefined;
    await Mocks1.fetch(options);
    await Mocks2.fetch(options);
  });

  it('retry', async () => {
    const options = {};
    class Retry extends Yandex {
      public retry = true;

      public retries = 5;

      public baseURL = 'http://undefined';

      public retryDelay = (retryCount: number) => {
        return 100;
      };

      public timeout = 1000;

      public retryCondition = () => true;
    }
    try {
      await Retry.fetch(options);
    } catch (e: any) {
      expect(e.code === 'ENOTFOUND' || e.code === 'ECONNABORTED').to.be.equal(true);
    }
  });

  it('defaults', async () => {
    class Defaults extends Yandex {}
    Defaults.defaults.headers.common['x-test'] = '1';
    const { config } = await Defaults.fetch();
    const headers = <Record<string, unknown>>config.headers;
    expect(headers['x-test']).to.be.equal('1');
  });

  it('stubs default', async () => {
    class Stubs extends Yandex {}
    const data = 'hello world!';
    Stubs.stub({ data });
    let result = await Stubs.fetch();
    expect(result.data).to.be.equal(data);
    result = await Stubs.fetch();
    expect(result.data).to.be.not.equal(data);
  });

  it('stubs unmock', async () => {
    class Stubs extends Yandex {}
    const data = 'hello world!';
    Stubs.stub({ data }, true);
    let result = await Stubs.fetch();
    expect(result.data).to.be.equal(data);
    Stubs.unstub();
    result = await Stubs.fetch();
    expect(result.data).to.be.not.equal(data);
  });

  it('stubs persistent', async () => {
    class Stubs extends Yandex {}
    const data = 'hello world!';
    Stubs.stub({ data }, true);
    let result = await Stubs.fetch();
    expect(result.data).to.be.equal(data);
    result = await Stubs.fetch();
    expect(result.data).to.be.equal(data);
  });

  it('stubs throws error', async () => {
    class Stubs extends Yandex {}
    const data = 'hello world!';
    Stubs.stub({ data, status: 400 }, true);
    try {
      await Stubs.fetch();
    } catch (e) {
      expect(e instanceof AxiosError);
    }
  });

  it("stubs don't throw errors", async () => {
    class Stubs extends Yandex {}
    const data = 'hello world!';
    Stubs.stub({ data, status: 200 }, true);
    const result = await Stubs.fetch(1);
    expect(result.data).to.be.equal(data);
  });

  it("stubs don't throws error if validateStatus ok", async () => {
    class Stubs extends Yandex {
      validateStatus: () => true;
    }
    const data = 'hello world!';
    Stubs.stub({ data, status: 400 }, true);
    try {
      await Stubs.fetch();
    } catch (e) {
      expect(e instanceof AxiosError);
    }
  });

  it('options check', async () => {
    class Options extends Yandex {}
    const data = 'hello world!';
    Options.stub({ data, status: 200 }, true);
    await Options.fetch(1);
    await Options.fetch(2);
    await Options.fetch(3);
    expect(Options.options.first).to.be.equal(1);
    expect(Options.options.last).to.be.equal(3);
    expect(Options.options[1]).to.be.equal(2);
  });
});
