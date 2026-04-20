import { expect } from 'vitest';
import { container } from '@biorate/inversion';
import { Root, root } from './__mocks__';

describe('@biorate/vault', () => {
  beforeAll(async () => await root.$run());

  it('write', async () =>
    await root.connector.current!.write('secret/data/test.json', {
      data: { hello: 'world' },
    }));

  it('read', async () => {
    const res = await root.connector.current!.read('secret/data/test.json');
    expect(res.data.data).toMatchSnapshot();
  });

  it('delete', async () => await root.connector.current!.delete('secret/data/test.json'));
});
