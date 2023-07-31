import { expect } from 'chai';
import { container } from '@biorate/inversion';
import { Root } from './__mocks__';

describe('@biorate/clickhouse', function () {
  let root: Root;
  this.timeout(3e4);

  before(async () => {
    root = container.get<Root>(Root);
    await root.$run();
  });

  it('test', async () => {
    const data = await root.connector!.query<{ result: number }>('SELECT 1 AS result;');
    expect(data[0].result).toMatchSnapshot();
  });
});
