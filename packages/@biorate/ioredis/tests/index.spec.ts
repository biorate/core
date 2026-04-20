import { expect } from 'vitest';
import { root } from './__mocks__';

describe('@biorate/ioredis', () => {
  beforeAll(async () => await root.$run());

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
