import { expect } from 'vitest';
import { root, Root } from './__mocks__';

describe('@biorate/proxy', () => {
  it('connection', async () => await root.$run());

  it('write', () =>
    new Promise((done) => {
      const socket = Root.connect();
      socket.write('Hello');
      socket.on('data', (data) => {
        expect(data.toString()).toMatchSnapshot();
        done();
      });
    }));
});
