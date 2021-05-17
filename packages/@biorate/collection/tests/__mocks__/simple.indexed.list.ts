import * as collection from '../../src';

export class List extends collection.List<{ a?: number; b?: number; c?: number }> {
  protected get _keys() {
    return [[List.index]];
  }

  protected get _Item() {
    return null;
  }
}

export const items = [{ a: 1 }, { b: 2 }, { c: 3 }];

export const list = new List(items);
