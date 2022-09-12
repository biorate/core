import { expect } from 'chai';
import { Google } from './__mocks__';

describe('@biorate/axios-prometheus', function () {
  this.timeout(3000);

  it('fetch', async () => expect((await Google.fetch()).status).to.be.equal(200));

  it('log', async () => {
    expect(Google.logResult).to.be.an('object').property('statusCode').to.be.equal(200);
    expect(Google.logResult).to.be.an('object').property('startTime').to.be.an('array');
  });
});
