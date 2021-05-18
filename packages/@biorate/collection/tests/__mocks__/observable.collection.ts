import * as collection from '../../src';
const { embed, observable } = collection;

export class List extends collection.ObservableList<Item> {
  protected get _keys() {
    return [['id']];
  }

  protected get _Item() {
    return Item;
  }
}

export class Item extends collection.ObservableItem {
  @observable() @embed(Item.Int) public id: number = null;
  @observable() @embed(Item.String) public string: string = null;
}

export function create(callback: (...args: any[]) => void, items?: any[]) {
  const list = new List(items);
  const cb = (data) => {
    list.unsubscribe(cb);
    callback(data);
  };
  list.subscribe(cb);
  return list;
}
