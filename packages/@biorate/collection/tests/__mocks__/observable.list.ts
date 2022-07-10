import * as collection from '../../src';

export class List extends collection.ObservableList<{ id: number }> {
  protected get _keys() {
    return [['id']];
  }
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

export const item = { id: 1 };
