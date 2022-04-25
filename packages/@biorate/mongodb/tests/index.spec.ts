import { expect } from 'chai';
import { container } from '@biorate/inversion';
import { Root, TestModel } from './__mocks__';

describe('@biorate/mongodb', function () {
  let root: Root;
  this.timeout(3e4);

  before(async () => {
    root = container.get<Root>(Root);
    await root.$run();
    await root.connector.connection().dropDatabase();
  });

  after(async () => {
    await root.connector.connection().dropDatabase();
  });

  it('connection access', () =>
    expect(root.connector.connection('connection').name).toMatchSnapshot());

  it('insert into test collection', async () => {
    const data = await new root.test({
      firstName: 'Vasya',
      lastName: 'Pupkin',
      age: 36,
    }).save();
    expect({
      firstName: data.firstName,
      lastName: data.lastName,
      age: data.age,
    }).toMatchSnapshot();
  });

  it('get from test collection', async () =>
    expect(await root.test.find({ firstName: 'Vasya' }, { _id: 0 })).toMatchSnapshot());
});
