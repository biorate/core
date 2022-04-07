import { expect } from 'chai';
import { Yandex } from './__mocks__';

describe('@biorate/axios', function () {
  it('fetch', async () => expect((await Yandex.fetch<string>()).status).to.be.equal(200));
});
