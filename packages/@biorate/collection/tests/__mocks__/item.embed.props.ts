import * as collection from '../../src';
import { create } from '@biorate/symbolic';
import { DateTime } from 'luxon';
const { embed, inject, singletone } = collection;

export const Types = create('Types');

@singletone()
export class Injectable {}

export class Binded {}

export class Nested extends collection.Item {
  @embed(Nested.Map) public map: Map<any, any> = null;
  @embed(Nested.Set) public set: Set<any> = null;
  @embed(Types.Binded) public binded: Binded = null;
  @inject(Injectable) public injectable: Injectable = null;
}

export class Item extends collection.Item {
  @embed(Item.Int) public int: number = null;
  @embed(Item.Float) public float: number = null;
  @embed(Item.String) public string: string = null;
  @embed(Item.Bool) public bool: boolean = null;
  @embed(Item.Date) public date: Date = null;
  @embed(Item.Luxon) public luxon: DateTime = null;
  @embed(Item.Array) public array: number[] = null;
  @embed(Item.Object) public object: Record<string, any> = null;
  @embed(Item.Json) public json: Record<string, any> = null;
  @embed(Nested) public nested: Nested = null;
  @inject(Injectable) public injectable: Injectable = null;
}

export const data = {
  int: 1,
  float: 1.1,
  string: 'test',
  bool: true,
  date: new Date(),
  luxon: new Date(),
  array: [1, 2, 3],
  object: { a: 1, b: 2 },
  json: '{"test": 1}',
  nested: {
    map: [
      [1, 'a'],
      [2, 'b'],
    ],
    set: [1, 2, 3],
  },
};

Item.bind(Types.Binded, Binded);




// import { Item as Base, embed } from '@biorate/collection';

class Item1 extends collection.Item {
  @embed(Item.Int) public int: number = null;
  @embed(Item.Float) public float: number = null;
  @embed(Item.String) public string: string = null;
  @embed(Item.Bool) public bool: boolean = null;
}

const item = new Item1().initialize({ int: 1, float: 1.1, string: 'test', bool: false });

console.log(item);
