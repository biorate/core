import { expect } from 'vitest';
import { container } from '@biorate/inversion';
import { Root, TestModel, root } from './__mocks__';

describe('@biorate/sequelize', () => {
  beforeAll(async () => {
    await root.$run();
    await TestModel.drop();
  });

  afterAll(async () => {
    await TestModel.drop();
  });

  it('query', async () =>
    expect(
      (
        await root.connector.query<{ result: number }>(
          'SELECT $first + $second AS result',
          { bind: { first: 2, second: 2 } },
        )
      )[0],
    ).toMatchSnapshot());

  it('sync', async () => expect(await TestModel.sync()).toMatchSnapshot());

  it('create', async () =>
    expect(await TestModel.create({ title: 'test', value: 1 })).toMatchSnapshot());

  it('find', async () =>
    expect(await TestModel.findOne({ where: { title: 'test' } })).toMatchSnapshot());
});
