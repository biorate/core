import { expect } from 'chai';
import { Yandex } from './__mocks__';
import { AxiosError } from '../src';

describe('@biorate/axios', function () {
  this.timeout(3000);

  it('fetch', async () => expect((await Yandex.fetch()).status).to.be.equal(200));

  it('catch', (done) => {
    class Catch extends Yandex {
      protected async catch() {
        done();
      }
    }
    Catch.fetch({ baseURL: 'http://undefined' });
  });

  it('finally', (done) => {
    class Finally extends Yandex {
      protected async finally() {
        done();
      }
    }
    Finally.fetch({ baseURL: 'http://undefined' });
  });

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

      public timeout = 3000;

      public retryCondition = () => true;
    }
    try {
      await Retry.fetch(options);
    } catch (e: any) {
      expect(e.code === 'ENOTFOUND').to.be.equal(true);
    }
  });

  it('defaults', async () => {
    class Defaults extends Yandex {}
    Defaults.defaults.headers.common['x-test'] = 1;
    const { config } = await Defaults.fetch();
    const headers = <Record<string, unknown>>config.headers;
    expect(headers['x-test']).to.be.equal(1);
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

  it('stubs throws errors', async () => {
    class Stubs extends Yandex {}
    const data = 'hello world!';
    Stubs.stub({ data, status: 400 }, true);
    try {
      await Stubs.fetch();
    } catch (e) {
      expect(e instanceof AxiosError);
    }
  });

  it('stubs un throw errors', async () => {
    class Stubs extends Yandex {}
    const data = 'hello world!';
    Stubs.stub({ data, status: 200 }, true);
    const result = await Stubs.fetch();
    expect(result.data).to.be.equal(data);
  });
});
