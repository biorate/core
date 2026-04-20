import { expect } from 'chai';
import { Google, Prometheus } from './__mocks__';

describe('@biorate/axios-prometheus', () => {
  it('fetch', async () => expect((await Google.fetch()).status).to.be.equal(200));

  it('log', async () => {
    expect(Google.logResult).to.be.an('object').property('statusCode').to.be.equal(200);
    expect(Google.logResult).to.be.an('object').property('startTime').to.be.an('array');
  });

  it('mocks', async () => {
    Google.useMock();
    const { data: d1, status: s1, statusText: st1 } = await Google.fetch();
    const { data: d2, status: s2, statusText: st2 } = await Google.fetch();
    expect(d1).to.be.deep.equal(d2);
    expect(s1).to.be.deep.equal(s2);
    expect(st1).to.be.deep.equal(st2);
  });

  it('metrics', async () => {
    const result = await Prometheus.registry.metrics();
    expect(result.includes('http_client_requests_seconds_bucket')).to.be.deep.equal(true);
    expect(result.includes('http_client_requests_seconds_count')).to.be.deep.equal(true);
  });
});
