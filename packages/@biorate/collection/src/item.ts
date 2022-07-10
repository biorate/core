import 'reflect-metadata';
import { define } from '@biorate/tools';
import { DateTime } from 'luxon';
import { isObject } from 'lodash';
import { Props, Types } from './symbols';

/**
 * @description
 * The [Item](https://biorate.github.io/core/classes/collection.item.html)
 * extensions is designed to form the structure of the object, solve the problem of application architecture,
 * dependency injection and inversion of control.
 *
 * ### Features:
 * - cast to type properties
 * - DI
 * - IoC
 *
 * @example
 * ```
 * import * as collection from '@biorate/collection';
 * const { embed, singletone } = collection;
 * const BindedSymbol = Symbol('Binded');
 *
 * @singletone()
 * class Binded {
 *   public hello = 'world!';
 * }
 *
 * class Nested extends collection.Item {
 *   @embed(Nested.Map) public map: Map<any, any> = null;
 *   @embed(Nested.Set) public itemSet: Set<any> = null;
 *   @embed(BindedSymbol) public binded: Binded = null;
 * }
 *
 * class Item extends collection.Item {
 *   @embed(Item.Int) public int: number = null;
 *   @embed(Item.Float) public float: number = null;
 *   @embed(Item.String) public string: string = null;
 *   @embed(Item.Bool) public bool: boolean = null;
 *   @embed(Item.Date) public date: Date = null;
 *   @embed(Item.Array) public array: number[] = null;
 *   @embed(Item.Object) public object: Record<string, any> = null;
 *   @embed(Item.Json) public json: Record<string, any> = null;
 *   @embed(Nested) public nested: Nested = null;
 *   @embed(BindedSymbol) public binded: Binded = null;
 * }
 *
 * Item.bind(BindedSymbol, Binded);
 *
 * const data = {
 *   int: 1,
 *   float: 1.1,
 *   string: 'test',
 *   bool: true,
 *   date: new Date(),
 *   array: [1, 2, 3],
 *   object: { a: 1, b: 2 },
 *   json: '{"test": 1}',
 *   nested: {
 *     map: [
 *       [1, 'a'],
 *       [2, 'b'],
 *     ],
 *     itemSet: [1, 2, 3],
 *   },
 * };
 *
 * const item = new Item();
 *
 * item.initialize(data);
 *
 * console.log(item);
 *   // Item {
 *   //   int: 1,
 *   //   float: 1.1,
 *   //   string: 'test',
 *   //   bool: true,
 *   //   date: 2021-05-19T06:42:26.049Z,
 *   //   array: [ 1, 2, 3 ],
 *   //   object: { a: 1, b: 2 },
 *   //   json: { test: 1 },
 *   //   nested: Nested {
 *   //     map: Map { 1 => 'a', 2 => 'b' },
 *   //     itemSet: Set { 1, 2, 3 },
 *   //     binded: Binded { hello: 'world!' }
 *   //   }
 *   // }
 *
 * console.log(item.binded === item.nested.binded); // true
 * ```
 */
export abstract class Item<P = { parent?: any }> {
  /** @description cast to **int** type symbol */
  public static readonly Int = Types.Int;
  /** @description cast to **string** type symbol */
  public static readonly String = Types.String;
  /** @description cast to **float** type symbol */
  public static readonly Float = Types.Float;
  /** @description cast to **boolean** type symbol */
  public static readonly Bool = Types.Bool;
  /** @description cast to **Date** type symbol */
  public static readonly Date = Types.Date;
  /** @description cast to **Object** type symbol */
  public static readonly Object = Types.Object;
  /** @description cast to **Array** type symbol */
  public static readonly Array = Types.Array;
  /** @description cast to **JSON** type symbol */
  public static readonly Json = Types.Json;
  /** @description cast to **Map** type symbol */
  public static readonly Map = Types.Map;
  /** @description cast to **Set** type symbol */
  public static readonly Set = Types.Set;
  /** @description cast to **Luxon** type symbol */
  public static readonly Luxon = Types.Luxon;

  /** @description Binding map, for IoC pattern realization */
  public static readonly bindings = new Map<string | symbol | Function, Function>();

  /**
   * @description Bind string, symbol, or Class to Class
   * @param key - dependency identifier
   * @param val - dependency Class
   * */
  public static bind(key: string | symbol | Function, val: Function) {
    return this.bindings.set(key, val);
  }

  /**
   * @description Instantiate and initialize class
   * @param data - data object
   * @param field - object field
   * @param Class - Instance class
   * */
  #defineClass = (
    data: Record<string, any>,
    field: string,
    Class: new (...args: any[]) => any,
  ) => {
    if (!(this[field] instanceof Class)) this[field] = new Class(data[field], this);
    this[field].initialize?.(data[field]);
  };

  /**
   * @description Cache type
   * @param data - data object
   * @param field - object field
   * */
  #setType = (data: Record<string, any>, field: string) => {
    if (!(field in this[Props.types])) this[Props.types][field] = this[field];
  };

  /**
   * @description Get type from cache
   * @param data - data object
   * @param field - object field
   * */
  #getType = (data: Record<string, any>, field: string) => {
    let type = Reflect.getMetadata(Props.Class, Object.getPrototypeOf(this), field);
    if (!type) type = this[Props.types][field];
    if (Item.bindings.has(type)) type = Item.bindings.get(type);
    return type;
  };

  /**
   * @description Cast to type and set data value
   * @param data - data object
   * @param field - object field
   * */
  #setData = (data: Record<string, any>, field: string) => {
    const type = this.#getType(data, field);
    const items = Array.isArray(data[field]) ? data[field] : [];
    switch (type) {
      case Item.Int:
        this[field] = parseInt(data[field], 10) || 0;
        break;
      case Item.Float:
        this[field] = parseFloat(data[field]) || 0;
        break;
      case Item.Bool:
        this[field] = Boolean(data[field]);
        break;
      case Item.Date:
        this[field] = new Date(data[field]);
        break;
      case Item.Luxon:
        this[field] =
          data[field] instanceof Date
            ? DateTime.fromJSDate(data[field])
            : typeof data[field] === 'string'
            ? DateTime.fromISO(data[field])
            : DateTime.fromMillis(data[field]);
        break;
      case Item.Object:
        this[field] = isObject(data[field]) ? data[field] : {};
        break;
      case Item.Array:
        this[field] = Array.isArray(data[field]) ? data[field] : [];
        break;
      case Item.Json:
        try {
          this[field] = JSON.parse(data[field]);
        } catch (e) {
          this[field] = null;
        }
        break;
      case Item.String:
        this[field] = data[field] ? String(data[field]) : '';
        break;
      case Item.Map:
        this[Props.defineMapOrSet](field, items, Map);
        break;
      case Item.Set:
        this[Props.defineMapOrSet](field, items, Set);
        break;
      default:
        if (type instanceof Function) {
          this.#defineClass(data, field, type);
        } else {
          if (field in data) this[field] = data[field];
        }
        break;
    }
  };

  /**
   * @description Cache type and apply data value
   * @param data - data object
   * @param field - object field
   * */
  #validate = (data: Record<string, any>, field: string) => {
    data = data || {};
    this.#setType(data, field);
    this.#setData(data, field);
  };

  [Props.defineMapOrSet](
    field: string,
    items: any[],
    Ctor: { new (...args: any[]): any },
  ) {
    if (
      !this[field] ||
      typeof this[field] !== 'object' ||
      (!('add' in this[field]) && !('set' in this[field]))
    )
      this[field] = new Ctor(items);
    else
      items.forEach((item) =>
        this[field].set ? this[field].set(...item) : this[field].add(item),
      );
  }

  /**
   * @param data - data object
   * @param parent - parent item
   * @example
   * ```
   * import * as collection from '@biorate/collection';
   *
   * class Item extends collection.Item {
   *   @embed(Item.Int) public id: number = null;
   *   @embed(Item.String) public title: string = null;
   * }
   *
   * const item = new Item().initialize({ id: 1, title: 'one' });
   * ```
   */
  public constructor(data: Record<string, any> = null, parent: P = null) {
    define.prop(this)(Props.parent, parent, 'c')(Props.types, {}, 'w')(
      Props.data,
      data,
      'w',
    );
  }

  /**
   * @description Initialize object properties
   * @param data - data object
   * @example
   * ```
   * import * as collection from '@biorate/collection';
   *
   * class Item extends collection.Item {
   *   @embed(Item.Int) public id: number = null;
   *   @embed(Item.String) public title: string = null;
   * }
   *
   * const item = new Item();
   * console.log(item); // Item { id: null, title: null }
   * item.initialize({ id: 1, title: 'one' });
   * console.log(item); // Item { id: 1, title: 'one' }
   * item.initialize({ id: 2, title: 'two' });
   * console.log(item); // Item { id: 2, title: 'two' }
   * ```
   */
  public initialize(data: Record<string, any> = this[Props.data]) {
    this[Props.data] = data;
    for (const field in this) {
      if (!(field in this)) continue;
      this.#validate(data, field);
    }
    return this;
  }

  /**
   * @description Change data values
   * @param data - data object
   *
   * @example
   * ```
   * import * as collection from '@biorate/collection';
   *
   * class Item extends collection.Item {
   *   @embed(Nested.Int) public int: number = null;
   *   @embed(Nested.String) public string: string = null;
   * }
   *
   * const item = new Item().initialize({ int: 1, string: 'test' }});
   * item.set({ int: 2, string: 'hello' }});
   * console.log(item); // Item { int: 2, string: 'hello' }
   * ```
   */
  public set(data: Record<string, any>) {
    for (const field in data) {
      if (!(field in this)) continue;
      this.#validate(data, field);
    }
    return this;
  }

  /**
   * @description Alias to parent class
   */
  public get parent(): P {
    return this[Props.parent];
  }
}
