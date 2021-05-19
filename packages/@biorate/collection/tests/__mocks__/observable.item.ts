import * as collection from '../../src';
const { embed, observable } = collection;

export class Nested extends collection.ObservableItem {
  @observable() @embed(Nested.Map) public map: Map<any, any> = null;
  @observable() @embed(Nested.Set) public set: Set<any> = null;
}

export class Item extends collection.ObservableItem {
  @observable() @embed(Item.Int) public int: number = null;
  @observable() @embed(Item.Float) public float: number = null;
  @observable() @embed(Item.String) public string: string = null;
  @embed(Nested) public nested: Nested = null;
}

export const data = {
  int: 1,
  float: 1.1,
  string: 'test',
  nested: {
    int: 1,
    map: [
      [1, 'a'],
      [2, 'b'],
    ],
    set: [1, 2, 3],
  },
};

export const item = new Item().initialize(data);

export function create(callback: (...args: any[]) => void) {
  const cb = (data) => {
    item.unsubscribe(cb);
    callback(data);
  };
  item.subscribe(cb);
  return item;
}
