import { expect } from 'chai';
import { root, Root } from './__mocks__';

describe('@biorate/proxy', function () {
  this.timeout(30e3);

  it('connection', async () => {
    await root.$run();
  });

  it('write', (done) => {
    const socket = Root.connect();
    socket.write('Hello');
    socket.on('data', (data) => {
      expect(data.toString()).toMatchSnapshot();
      done();
    });
  });

  it('metrics', async () => {
    const result = await root.prometheus.registry.metrics();
    expect(result.includes('proxy_connector_write_bytes')).to.be.a('boolean').equal(true);
    expect(result.includes('proxy_connector_read_bytes')).to.be.a('boolean').equal(true);
    expect(result.includes('proxy_connector_active')).to.be.a('boolean').equal(true);
  });
});
