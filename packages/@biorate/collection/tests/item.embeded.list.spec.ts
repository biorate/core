import { assert } from 'chai';
import { Data, items1, items2 } from './__mocks__/item.embeded.list';

describe.only('Item embeded list', () => {
  it('initialize', () => {
    const data = new Data();
    data.initialize(items1);
    console.log([...data.list]);
    data.initialize(items2);
    console.log([...data.list]);
  });
});
