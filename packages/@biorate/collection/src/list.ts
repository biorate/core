import { EventEmitter } from 'events';
import { define } from '@biorate/tools';
import { Props } from './symbols';
import { CollectionListItemAlreadyExistsError } from './errors';
import { ICollection } from '../interfaces';

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
 *
 *   protected get _Item() {
 *     return null;
 *   }
 * }
 *
 * const list = new List();
 *
 * list.set({ id: 1, title: 'one' }, { id: 2, title: 'two' }, { id: 3, title: 'three' });
 *
 * console.log(list.get(1)); // { id: 1, title: 'one' }
 * console.log(list.get(2)); // { id: 2, title: 'two' }
 * console.log(list.get(3)); // { id: 3, title: 'three' }
 * ```
 */
export abstract class List<I = any, P = { parent?: any }> extends EventEmitter {
  static get index() {
    return Props.Index;
  }

  #map = new Map<string, I>();
  #set = new Set<I>();
  #processed: any = null;

  public constructor(items?: any[], parent: P = null) {
    super();
    define.prop(this)('_events', {}, 'cw')('_eventsCount', 0, 'cw')(
      '_maxListeners',
      10,
      'cw',
    )(Props.parent, parent, 'c');
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

  *[Symbol.iterator](): Generator<I> {
    for (const item of this.#set) yield item;
  }

  protected get _set() {
    return this.#set;
  }

  protected set _set(value) {
    this.#set = value;
  }

  protected abstract get _keys(): ICollection.Keys;

  protected abstract get _Item(): { new (...args): I } | null;

  public get parent(): P {
    return this[Props.parent];
  }

  public get size() {
    return this.#set.size;
  }

  public get processed() {
    return this.#processed;
  }

  public set(...args: any[]): I[] {
    const result = [];
    for (let item of args) {
      this.#processed = item;
      if (this._Item) {
        let instance = new this._Item(this) as { initialize?: (item: any) => {} };
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
      this.emit('added', item);
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
      this.emit('delete', item);
    }
    if (isIndexed) this.#reindex();
    return true;
  }

  public clear() {
    const items = [...this.#set];
    this.#map.clear();
    this.#set.clear();
    this.emit('clear', items);
  }
}
