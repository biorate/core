import { expect } from 'chai';
import { root } from './__mocks__';

describe('@biorate/clickhouse', function () {
  this.timeout(3e4);

  before(async () => {
    await root.$run();
  });

  it('query', async () => {
    const cursor = await root.connector
      .get()
      .query({ query: 'SELECT 1 AS result;', format: 'JSON' });
    const { data } = await cursor.json<{ result: number }>();
    expect(data[0].result).toMatchSnapshot();
  });
});
