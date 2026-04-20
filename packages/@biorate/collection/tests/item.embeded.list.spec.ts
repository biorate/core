import { expect } from 'vitest';
import { Data, items1, items2 } from './__mocks__/item.embeded.list';

describe('Item embeded list', () => {
  it('initialize', () => {
    const data = new Data();
    data.initialize(items1);
    expect(data).toMatchSnapshot();
    data.initialize(items2);
    expect(data).toMatchSnapshot();
  });
});
