import * as collection from '../../src';

export class List extends collection.List<{ id: number }> {
  protected get _keys() {
    return [['id']];
  }

  protected get _Item() {
    return null;
  }
}

export const items = [{ id: 1 }, { id: 2 }];

export const list = new List(items);
