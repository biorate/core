import * as collection from '../../src';

export class Binded {
}

export class Nested extends collection.Item {
  public map = Item.Map;
  public itemSet = Item.Set;
  public binded = Binded;
}

export class Item extends collection.Item {
  public int = Item.Int;
  public float = Item.Float;
  public string = Item.String;
  public bool = Item.Bool;
  public date = Item.Date;
  public luxon = Item.Luxon;
  public json = Item.Json;
  public array = Item.Array;
  public object = Item.Object;
  public nested = Nested;
}

export const data = {
  int: 1,
  float: 1.1,
  string: 'test',
  bool: true,
  date: new Date(),
  luxon: new Date(),
  json: '{"test": 1}',
  array: [1, 2, 3],
  object: { a: 1, b: 2 },
  nested: {
    map: [
      [1, 'a'],
      [2, 'b'],
    ],
    itemSet: [1, 2, 3],
  },
};
