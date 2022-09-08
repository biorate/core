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
});
