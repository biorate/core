import * as collection from '../../src';
const { embed } = collection;

export class Item extends collection.Item {
  @embed(Item.Int) public id: number = null;
}

export class List extends collection.List<Item> {
  protected get _keys() {
    return [['id']];
  }

  protected get _Item() {
    return Item;
  }
}

export class Data extends collection.Item {
  @embed(List) public list: List = null;
}

export const items1 = { list: [{ id: 1 }, { id: 2 }] };
export const items2 = { list: [{ id: 3 }, { id: 4 }] };
