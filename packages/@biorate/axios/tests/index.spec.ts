import { expect } from 'chai';
import { Yandex } from './__mocks__';

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
});
