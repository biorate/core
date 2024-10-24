import { expect } from 'chai';
import { root } from './__mocks__';

describe('@biorate/ioredis', function () {
  this.timeout(3e4);

  before(async () => await root.$run());

  it('set', async () => {
    expect(await root.connector.current!.set('key', 'value')).toMatchSnapshot();
  });

  it('get', async () => {
    expect(await root.connector.current!.get('key')).toMatchSnapshot();
  });

  it('delete', async () => {
    expect(await root.connector.current!.del('key')).toMatchSnapshot();
  });
});
