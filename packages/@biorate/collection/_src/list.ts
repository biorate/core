import { EventEmitter } from 'events';
import { define } from '@biorate/tools';
import { observable, observe } from 'mobx';
import { Item } from './item';
import { Props } from './symbols';
import { ICollection } from '../interfaces';
import { CollectionListItemAlreadyExistsError } from './errors';

export abstract class List<I, P = any> extends EventEmitter {
  public static get index() {
    return Props.Index;
  }

  #callbacks: Set<(...args) => void> = new Set();
  #set = observable(new Set<I>(), { deep: true });
  #map = new Map<string | symbol, I>();
  #processed = null;

  public constructor(parent = null, data: List<Item> | unknown[] = []) {
    super();
    define.prop(this)('_events', {}, 'cw')('_eventsCount', 0, 'cw')(
      '_maxListeners',
      10,
      'cw',
    )(Props.parent, parent, 'c');
    observe(this.#set, (...args) => this[Props.OnObserve](...args));
    if (Array.isArray(data)) this.set(...data);
    else if (data && 'toJSON' in data) this.set(...data.toJSON());
  }

  public get parent(): P {
    return this[Props.parent];
  }

  public subscribe(callback: (...args) => void) {
    this.#callbacks.add(callback);
    return this;
  }

  public unsubscribe(callback: (...args) => void) {
    this.#callbacks.delete(callback);
    return this;
  }

  public reinitialize(data: unknown[]) {
    this.clear();
    this.set(...data);
  }

  *[Symbol.iterator](): Generator<any> {
    for (const item of this.#set) yield item;
  }

  public get size() {
    return this.#set.size;
  }

  public get processed() {
    return this.#processed;
  }

  protected get _keys(): ICollection.Keys {
    return [['id']];
  }

  public set(...args: any[]): ICollection.Result<I> {
    const result = [];
    for (let item of args) {
      this.#processed = item;
      if (this.Item) item = (new this.Item(this) as any).initialize?.(item);
      for (const key of this.#indexer(item)) {
        if (this.#map.has(key))
          throw new CollectionListItemAlreadyExistsError(this.constructor.name, key);
        this.#map.set(key, item);
      }
      this.#processed = null;
      this.#add(item);
      result.push(item);
    }
    return result.length <= 1 ? result[0] : result;
  }

  public get(...args): ICollection.Result<I> {
    let item;
    const result = [];
    for (const key of this.#indexer(args)) {
      item = this.#map.get(key);
      if (item && !~result.indexOf(item)) result.push(item);
    }
    return result.length ? (result.length > 1 ? result : result[0]) : false;
  }

  public has(...args) {
    let item;
    for (const key of this.#indexer(args)) {
      item = this.#map.has(key);
      if (item) return true;
    }
    return false;
  }

  public delete(...args) {
    let isIndexed,
      i,
      items = this.get(...args);
    const reIndex = [];
    if (!items) return false;
    items = Array.isArray(items) ? items : [items];
    for (const item of items) {
      isIndexed = Props.Index in item;
      this.#delete(item);
      for (const key of this.#indexer(item)) this.#map.delete(key);
    }
    if (isIndexed) {
      i = 0;
      for (const item of this) {
        item[Props.Index] = i++;
        reIndex.push(item);
      }
      this.reinitialize(reIndex);
    }
    return true;
  }

  public clear() {
    for (const item of this) this.#dispose(item);
    this.#set.clear();
    this.emit('cleared');
    this.#map.clear();
  }

  public keys() {
    return [...this.#map.keys()];
  }

  public getBy(criteria, all = false): ICollection.Result<I> {
    const res = [];
    if (Object.keys(criteria).length <= 0) return false;
    for1: for (const item of this) {
      for2: for (const field in criteria)
        if (item[field] != criteria[field]) continue for1;
      if (!all) return item;
      res.push(item);
    }
    if (res.length) return res;
    return false;
  }

  public toJSON() {
    const result = [];
    for (let item of this) result.push('toJSON' in item ? item['toJSON']() : item);
    return result;
  }

  public toArray() {
    return [...this];
  }

  #delete = (item) => {
    this.#set.delete(item);
    this.#dispose(item);
    this.emit('deleted', item);
  };

  #dispose = (item) => item[Props.Disposer]();

  #add = (item) => {
    this.#set.add(item);
    this.emit('added', item);
    if (!(item instanceof Item))
      Item.observe(item, (...args) => this[Props.OnObserve](...args));
  };

  [Props.OnObserve](...args) {
    for (const callback of this.#callbacks) callback(...args);
    this[Props.parent]?.[Props.OnObserve]?.();
  }

  #makeKey = (key, val) => key.map((k) => String(k)).join('.') + '|' + val.join('.');

  #indexer = (item, result = [], key: any = this._keys) => {
    if (Array.isArray(key[0])) {
      for (const field of key) this.#indexer(item, result, field);
    } else {
      for (const k of key)
        if (k === Props.Index && !(Props.Index in item)) item[Props.Index] = this.size;
      result.push(
        this.#makeKey(key, Array.isArray(item) ? item : key.map((k) => item[k])),
      );
    }
    return result;
  };

  [Symbol.for('nodejs.util.inspect.custom')]() {
    return this.toArray();
  }

  protected abstract get Item(): { new (...args: any[]): I };
}
