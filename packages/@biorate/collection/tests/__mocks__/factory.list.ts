import * as collection from '../../src';

export class Item {
  a: number;
  b: string;

  initialize(data: { a: number, b: string }) {
    this.a = data.a;
    this.b = data.b;
    return this;
  }
}

export class List extends collection.List<Item> {
  protected get _keys() {
    return [['a']];
  }

  protected get _Item() {
    return Item;
  }
}

export const items = [{ a: 1, b: 'test' }, { a: 2, b: 'test' }];

export const list = new List(items);
