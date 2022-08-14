import { expect, use } from 'chai';
import { Data, items1, items2 } from './__mocks__/item.embeded.list';
import { jestSnapshotPlugin } from 'mocha-chai-jest-snapshot';

use(jestSnapshotPlugin());

describe('Item embeded list', () => {
  it('initialize', () => {
    const data = new Data();
    data.initialize(items1);
    expect(data).toMatchSnapshot();
    data.initialize(items2);
    expect(data).toMatchSnapshot();
  });
});
