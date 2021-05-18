import { define } from '@biorate/tools';
import { Props } from './symbols';
import { CollectionListItemAlreadyExistsError } from './errors';
import { ICollection } from '../interfaces';
import { Ctor } from './types';

/**
 * @description
 * This class provides manipulation of documents collections.
 * Multi-index and object factory supported.
 *
 * ### Features:
 * - multi-indexing
 * - iterable
 * - factory
 *
 * @example
 * ```
 * import * as collection from '@biorate/collection';
 *
 * class List extends collection.List<{ id: number }> {
 *   protected get _keys() {
 *     return [['id']];
 *   }
 * }
 *
 * const list = new List();
 *
 * list.set({ id: 1, title: 'one' }, { id: 2, title: 'two' }, { id: 3, title: 'three' });
 *
 * console.log(list.find(1)); // { id: 1, title: 'one' }
 * console.log(list.find(2)); // { id: 2, title: 'two' }
 * console.log(list.find(3)); // { id: 3, title: 'three' }
 * ```
 */
export abstract class List<I = any, P = { parent?: any }> {
  /**
   * @description Alias for index-symbol, if used in **_keys**
   * getter - enumerate and index items with sequence number.
   */
  static get index() {
    return Props.Index;
  }

  /**
   * @description All keys combination storage
   */
  #map = new Map<string, I>();

  /**
   * @description Unique items storage
   */
  #set = new Set<I>();

  /**
   * @description Current processing item alias,
   * useful for dynamic class substitution in **_Item** getter
   */
  #processed: Record<string, any> = null;

  /**
   * @param items - initialization items
   * @param parent - parent item
   */
  public constructor(items: any[] = [], parent: P = null) {
    define.prop(this)(Props.parent, parent, 'c');
    this.set(...items);
  }

  #key = (key: (string | symbol)[], val: any[]) =>
    key.map((k) => String(k)).join('.') + '|' + val.join('.');

  #indexer = (item: any, keys: any = this._keys, result = []): string[] => {
    if (Array.isArray(keys[0])) {
      for (const key of keys) this.#indexer(item, key, result);
    } else {
      for (const k of keys)
        if (k === Props.Index && !(Props.Index in item)) item[Props.Index] = this.size;
      result.push(this.#key(keys, Array.isArray(item) ? item : keys.map((k) => item[k])));
    }
    return result;
  };

  /**
   * @description Reindex sequence number in all items
   */
  #reindex = () => {
    let i = 0;
    const items = [];
    for (const item of this) {
      item[Props.Index] = i++;
      items.push(item);
    }
    this.clear();
    this.set(...items);
  };

  [Symbol.for('nodejs.util.inspect.custom')]() {
    return [...this];
  }

  /**
   * @description Instance can be iterated by unique items storage
   * @example
   * ```ts
   * const list = new List([{ id: 1 }, { id: 2 }, { id: 3 }]);
   * for (const item of list)
   *   console.log(item);
   * ```
   */
  *[Symbol.iterator](): Generator<I> {
    for (const item of this.#set) yield item;
  }

  /**
   * @description Getter alias for unique items storage (for internal usage)
   */
  protected get _set() {
    return this.#set;
  }

  /**
   * @description Setter alias for unique items storage (for internal usage)
   */
  protected set _set(value) {
    this.#set = value;
  }

  /**
   * @description Indexes map
   * @example
   * ```ts
   * class List extends collection.List<{ a: number; b: number; c: number }> {
   *   protected get _keys() {
   *     return [
   *       ['a', 'b'],
   *       ['b', 'c'],
   *     ];
   *   }
   * }
   *
   * const list = new List([
   *   { a: 1, b: 1, c: 3 },
   *   { a: 2, b: 2, c: 2 },
   *   { a: 3, b: 1, c: 1 },
   * ]);
   *
   * console.log(list.get(1, 1)); // [ { a: 1, b: 1, c: 3 }, { a: 3, b: 1, c: 1 } ]
   * console.log(list.get(2, 2)); // [ { a: 2, b: 2, c: 2 } ]
   * ```
   */
  protected abstract get _keys(): ICollection.List.Keys;

  /**
   * @description Object instantiation. The constructor from which the instance
   * will be created must be passed here. If **null** is passed, the object that was
   * passed will be added to the collection.
   * @default **null**
   * @example
   * ```ts
   * class List extends collection.List<{ id: number }> {
   *   protected get _keys() {
   *     return [['id']];
   *   }
   *
   *   protected get _Item() {
   *     return null;
   *   }
   * }
   *
   * const list = new List([{ id: 1 }, { id: 2 }]);
   * console.log(list.find(1)); // { id: 1 }
   * console.log(list.find(1)); // { id: 2 }
   * ```
   * @example
   * ```ts
   * import * as collection from '@biorate/collection';
   * const { embed } = collection;
   *
   * class Item extends collection.Item {
   *    @embed(Item.Int) public id: number = null;
   *    @embed(Item.String) public title: string = null;
   * }
   *
   * class List extends collection.List<Item> {
   *   protected get _keys() {
   *     return [['id']];
   *   }
   *
   *   protected get _Item() {
   *     return Item;
   *   }
   * }
   *
   * const list = new List([{ id: 1, title: 'Cat' }, { id: 2, title: 'Dog' }]);
   * console.log(list.find(1)); // Item { id: 1, title: 'Cat' }
   * console.log(list.find(2)); // Item { id: 2, title: 'Dog' }
   * ```
   */
  protected get _Item(): Ctor<I> {
    return null;
  }

  /**
   * @description Alias to parent class
   */
  public get parent(): P {
    return this[Props.parent];
  }

  /**
   * @description Unique collection items count
   */
  public get size() {
    return this.#set.size;
  }

  /**
   * @description Alias to current processed item,
   * to private **#processed** property. Useful for dynamic
   * class substitution in **_Item** getter
   * @example
   * ```ts
   * class Base extends collection.Item {
   * }
   *
   * class One extends Base {
   *   id: number;
   *   type: string;
   * }
   *
   * class Two extends Base {
   *   id: number;
   *   type: string;
   * }
   *
   * class Three extends Base {
   *   id: number;
   *   type: string;
   * }
   *
   * const Types = { One, Two, Three }
   *
   * class List extends collection.List<{ id: number, type: string }> {
   *   protected get _keys() {
   *     return [['id']];
   *   }
   *
   *   protected get _Item() {
   *     return Types[this.processed.type];
   *   }
   * }
   *
   * const list = new List();
   * list.set({ id: 1, type: 'One' }, { id: 1, type: 'Two' }, { id: 1, type: 'Three' });
   * console.log(list.find(1));
   * console.log(list.find(2));
   * console.log(list.find(3));
   * ```
   */
  public get processed() {
    return this.#processed;
  }

  public set(...args: any[]): I[] {
    const result = [];
    for (let item of args) {
      this.#processed = item;
      if (this._Item) {
        let instance = new this._Item(item, this) as { initialize?: (item: any) => {} };
        instance.initialize?.(item);
        item = instance;
      }
      this.#processed = null;
      for (const key of this.#indexer(item)) {
        if (this.#map.has(key))
          throw new CollectionListItemAlreadyExistsError(this.constructor.name, key);
        this.#map.set(key, item);
      }
      this.#set.add(item);
      result.push(item);
    }
    return result;
  }

  public find(...args: any[]): I | undefined {
    for (const key of this.#indexer(args))
      if (this.#map.has(key)) return this.#map.get(key);
  }

  public getBy(criteria: Record<string | symbol, any>, one = false): I[] {
    const result = [];
    if (Object.keys(criteria).length <= 0) return result;
    for1: for (const item of this) {
      for2: for (const field in criteria)
        if (item[field] != criteria[field]) continue for1;
      if (one) return [item];
      result.push(item);
    }
    return result;
  }

  public get(...args: any[]): I[] {
    const result = [];
    for (const key of this.#indexer(args)) {
      const item = this.#map.get(key);
      if (item && !~result.indexOf(item)) result.push(item);
    }
    return result;
  }

  public has(...args: any[]) {
    for (const key of this.#indexer(args)) if (this.#map.has(key)) return true;
    return false;
  }

  public delete(...args: any[]) {
    let isIndexed: boolean,
      items = this.get(...args);
    if (!items.length) return false;
    for (const item of items) {
      isIndexed = Props.Index in item;
      this.#set.delete(item);
      for (const key of this.#indexer(item)) this.#map.delete(key);
    }
    if (isIndexed) this.#reindex();
    return true;
  }

  public clear() {
    this.#map.clear();
    this.#set.clear();
  }
}
