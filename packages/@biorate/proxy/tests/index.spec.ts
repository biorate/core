import { expect } from 'chai';
import { root, Root } from './__mocks__';

describe('@biorate/proxy', function () {
  this.timeout(3e4);

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
});
