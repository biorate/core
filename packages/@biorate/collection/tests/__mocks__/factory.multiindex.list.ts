import * as collection from '../../src';

export class ItemAB {
  a: string;
  b: string;

  initialize(data: { a?: string; b?: string; }) {
    this.a = data.a;
    this.b = data.b;
    return this;
  }
}

export class ListAB extends collection.List<ItemAB> {
  protected get _keys() {
    return [['a', 'b']];
  }

  protected get _Item() {
    return ItemAB;
  }
}

export const itemsAB = [
  { a: '1', b: 'test1' },
  { a: '2', b: 'test1' },
  { a: '2', b: 'test2' },
  { a: '3', b: 'test2' },
];

export const listAB = new ListAB(itemsAB);

export class ItemABBC {
  a: string;
  b: string;
  c: string;

  initialize(data: { a?: string; b?: string; c?: string }) {
    this.a = data.a;
    this.b = data.b;
    this.c = data.c;
    return this;
  }
}

export class ListABBC extends collection.List<ItemABBC> {
  protected get _keys() {
    return [['a', 'b'], ['b', 'c'], ['a', 'b', 'c']];
  }

  protected get _Item() {
    return ItemABBC;
  }
}

export const itemsABBC = [
  { a: '1', b: '2', c: '1' },
  { a: '2', b: '1', c: '2' },
  { a: '3', b: '1', c: '3' },
  { a: '4', b: '1', c: '4' },
];

export const listABBC = new ListABBC(itemsABBC);
