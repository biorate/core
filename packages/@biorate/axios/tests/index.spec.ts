import { expect } from 'chai';
import { Yandex } from './__mocks__';

describe('@biorate/axios', function () {
  it('fetch', async () => expect((await Yandex.fetch<string>()).status).to.be.equal(200));

  it('catch', (done) => {
    class Catch extends Yandex {
      protected async catch(e) {
        done();
      }
    }
    Catch.fetch({ baseURL: 'https://undefined' });
  });

  it('finally', (done) => {
    class Catch extends Yandex {
      protected async finally() {
        done();
      }
    }
    Catch.fetch({ baseURL: 'https://undefined' });
  });
});
