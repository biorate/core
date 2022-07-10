import { define } from '@biorate/tools';
import { Props } from './symbols';
import { CollectionListItemAlreadyExistsError } from './errors';
import { Ctor, ICollection } from '../interfaces';

const _map = Symbol('#map');
const _set = Symbol('#set');
const _key = Symbol('#key');
const _processed = Symbol('#processed');
const _indexer = Symbol('#indexer');
const _reindex = Symbol('#reindex');

/**
 * @description
 * The [List](https://biorate.github.io/core/classes/collection.list.html) extensions is intended for
 * solving problems associated with fast O(1) search for objects by given keys and fast iteration of a
 * collection of objects, multi-index and objects-factory supported.
 *
 * ### Features:
 * - Multi-indexing
 * - Native fast iterations (by [Set](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set))
 * - [Objects-factory](#processed)
 * - Fast O(1) object search (by [keys](#_keys))
 *
 * ### Disadvantages:
 * - Slow inserting new document (especially on large collections, inserting into
 * [Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map) +
 * [Set](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set))
 * - Slow delete (especially with sequence number index structures, because reindex all collection needed)
 *
 * @example
 * ```
 * import * as collection from '@biorate/collection';
 * const { embed } = collection;
 *
 * class Item extends collection.Item {
 *   @embed(Item.Int) public id: number = null;
 *   @embed(Item.String) public title: string = null;
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
 * const list = new List([{ id: 1, title: 'one' }, { id: 2, title: 'two' }]);
 *
 * list.set({ id: 3, title: 'three' }, { id: 4, title: 'four' });
 *
 * console.log(list.find(1)); // Item { id: 1, title: 'one' }
 * console.log(list.find(2)); // Item { id: 2, title: 'two' }
 * console.log(list.find(3)); // Item { id: 3, title: 'three' }
 * console.log(list.find(4)); // Item { id: 4, title: 'four' }
 * ```
 */
export abstract class List<I = any, P = { parent?: any }> {
  /**
   * @description Alias for index-symbol, if used in [_keys](#_keys)
   * getter - enumerate and index items with sequence number.
   * @example
   * ```ts
   * import { List as Base } from '@biorate/collection';
   *
   * class List extends Base<{ id: number }> {
   *   protected get _keys() {
   *     return [[Base.index]];
   *   }
   * }
   *
   * const list = new List([{ id: 3 }, { id: 2 }, { id: 1 }]);
   *
   * console.log(list.find(0)); // { id: 3, [Symbol(Props.Index)]: 0 }
   * console.log(list.find(1)); // { id: 2, [Symbol(Props.Index)]: 1 }
   * console.log(list.find(2)); // { id: 1, [Symbol(Props.Index)]: 2 }
   * ```
   */
  static get index() {
    return Props.Index;
  }

  /**
   * @description Key combinations storage
   */
  [_map] = new Map<string, I>();

  /**
   * @description Unique items storage
   */
  [_set] = new Set<I>();

  /**
   * @description Current processing item alias,
   * useful for dynamic class substitution in **_Item** getter
   */
  [_processed]: Record<string, any> = null;

  /**
   * @param items - initialization items
   * @param parent - parent item
   * @example
   * ```ts
   * import * as collection from '@biorate/collection';
   *
   * class List extends collection.List<{ id: number }> {
   *   protected get _keys() {
   *     return [['id']];
   *   }
   * }
   *
   * const list = new List([{ id: 1 }, { id: 2 }, { id: 3 }]);
   * ```
   */
  public constructor(items: any[] = [], parent: P = null) {
    define.prop(this)(Props.parent, parent, 'c');
    this.set(...items);
  }

  /**
   * @description Create index string key
   */
  [_key] = (key: (string | symbol)[], val: any[]) =>
    key.map((k) => String(k)).join('.') + '|' + val.join('.');

  /**
   * @description Create indexes string array
   */
  [_indexer] = (item: any, keys: any = this._keys, result = []): string[] => {
    if (Array.isArray(keys[0])) {
      for (const key of keys) this[_indexer](item, key, result);
    } else {
      for (const k of keys)
        if (k === Props.Index && !(Props.Index in item)) item[Props.Index] = this.size;
      result.push(this[_key](keys, Array.isArray(item) ? item : keys.map((k) => item[k])));
    }
    return result;
  };

  /**
   * @description Reindex sequence number in all items
   */
  [_reindex] = () => {
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
    for (const item of this[_set]) yield item;
  }

  /**
   * @description Getter alias for unique items storage (for internal usage)
   */
  protected get _set() {
    return this[_set];
  }

  /**
   * @description Setter alias for unique items storage (for internal usage)
   */
  protected set _set(value) {
    this[_set] = value;
  }

  /**
   * @description Indexes map. Designed to declare fields by which indexes will be built.
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
   * @example
   * ```ts
   * const list = new List([{ id: 1 }, { id: 2 }, { id: 3 }]);
   * console.log(list.size); // 3
   * ```
   */
  public get size() {
    return this[_set].size;
  }

  /**
   * @description Alias to current processed item,
   * to private **#processed** property. Useful for dynamic
   * class substitution in **_Item** getter
   * @example
   * ```ts
   * class Base extends collection.Item {
   *   id: number = null;
   *   type: string = null;
   * }
   * class One extends Base {}
   * class Two extends Base {}
   * class Three extends Base {}
   *
   * const Types = { One, Two, Three }
   *
   * class List extends collection.List<Base> {
   *   protected get _keys() {
   *     return [['id']];
   *   }
   *
   *   protected get _Item() {
   *     return Types[this.processed.type];
   *   }
   * }
   *
   * const list = new List([
   *   { id: 1, type: 'One' },
   *   { id: 2, type: 'Two' },
   *   { id: 3, type: 'Three' }
   * ]);
   *
   * console.log(list.find(1)); // One { id: 1, type: 'One' }
   * console.log(list.find(2)); // Two { id: 2, type: 'Two' }
   * console.log(list.find(3)); // Three { id: 3, type: 'Three' }
   * ```
   */
  public get _processed() {
    return this[_processed];
  }

  /**
   * @description Add item into collection
   * @example
   * ```ts
   * const list = new List();
   * list.set({ id: 1 }, { id: 2 }, { id: 3 });
   * ```
   */
  public set(...args: any[]): I[] {
    const result = [];
    for (let item of args) {
      this[_processed] = item;
      if (this._Item) {
        let instance = new this._Item(item, this) as { initialize?: (item: any) => {} };
        instance.initialize?.(item);
        item = instance;
      }
      this[_processed] = null;
      for (const key of this[_indexer](item)) {
        if (this[_map].has(key))
          throw new CollectionListItemAlreadyExistsError(this.constructor.name, key);
        this[_map].set(key, item);
      }
      this[_set].add(item);
      result.push(item);
    }
    return result;
  }

  /**
   * @description Get all items by criteria
   * @param criteria - query params
   * @param one - return only first item?
   *
   * @example
   * ```ts
   * const list = new List([{ id: 1, a: 1 }, { id: 2, a: 1 }, { id: 3, a: 2 }]);
   * list.getBy({ a: 1 }); // [{ id: 1, a: 1 }, { id: 2, a: 1 }]
   * list.getBy({ id: 1, a: 1 }); // [{ id: 1, a: 1 }]
   * ```
   */
  public getBy(criteria: Record<string | symbol, any>, one = false): I[] {
    const result = [];
    if (Object.keys(criteria).length <= 0) return result;
    for1: for (const item of this) {
      for2: for (const field in criteria)
        if (item[field] !== criteria[field]) continue for1;
      if (one) return [item];
      result.push(item);
    }
    return result;
  }

  /**
   * @description Find first item in collection by keys
   * @param args - key values
   * @example
   * ```ts
   * const list = new List([{ id: 1 }, { id: 2 }, { id: 3 }]);
   * list.find(1); // { id: 1 }
   * ```
   */
  public find(...args: any[]): I | undefined {
    for (const key of this[_indexer](args))
      if (this[_map].has(key)) return this[_map].get(key);
  }

  /**
   * @description Find all items in collection by keys
   * @param args - key values
   * @example
   * ```ts
   * const list = new List([{ id: 1 }, { id: 2 }, { id: 3 }]);
   * list.get(1); // [{ id: 1 }]
   * ```
   */
  public get(...args: any[]): I[] {
    const result = [];
    for (const key of this[_indexer](args)) {
      const item = this[_map].get(key);
      if (item && !~result.indexOf(item)) result.push(item);
    }
    return result;
  }

  /**
   * @description Check item exists in collection by keys
   * @param args - key values
   * @example
   * ```ts
   * const list = new List([{ id: 1 }, { id: 2 }, { id: 3 }]);
   * list.has(1); // true
   * list.has(4); // false
   * ```
   */
  public has(...args: any[]) {
    for (const key of this[_indexer](args)) if (this[_map].has(key)) return true;
    return false;
  }

  /**
   * @description Delete item from collection by keys
   * @param args - key values
   * @example
   * ```ts
   * const list = new List([{ id: 1 }, { id: 2 }, { id: 3 }]);
   * list.delete(1); // true
   * console.log(list); // [{ id: 2 }, { id: 3 }];
   * ```
   */
  public delete(...args: any[]) {
    let isIndexed: boolean,
      items = this.get(...args);
    if (!items.length) return false;
    for (const item of items) {
      isIndexed = Props.Index in item;
      this[_set].delete(item);
      for (const key of this[_indexer](item)) this[_map].delete(key);
    }
    if (isIndexed) this[_reindex]();
    return true;
  }

  /**
   * @description Clear collection
   * @example
   * ```ts
   * const list = new List([{ id: 1 }, { id: 2 }, { id: 3 }]);
   * console.log(list.size); // 3
   * list.clear();
   * console.log(list.size); // 0
   * ```
   */
  public clear() {
    this[_map].clear();
    this[_set].clear();
  }
}
