// import { EventEmitter } from 'events';
// // import { IConstructor, ICollection } from '@omninet/interfaces';
// import { prop } from '@biorate/tools/src/define';
// // import { observable, observe } from '@omninet/core';
// import { Item } from './item';
// import { Props } from './symbols';
// import { CollectionListItemAlreadyExistsError } from './errors';
//
// export class List<T = any> extends EventEmitter implements ICollection.List {
//   public static get index() {
//     return Props.Index;
//   }
//
//   #callbacks: Set<(...args) => void> = new Set();
//   #set = null;
//   #map = new Map();
//   #processed = null;
//
//   public constructor(parent = null, data: List | unknown[] = []) {
//     super();
//     prop(this)('_events', {}, 'cw')('_eventsCount', 0, 'cw')('_maxListeners', 10, 'cw')(
//       Props.parent,
//       parent,
//       'c',
//     );
//     this.#set = observable()(new Set(), { deep: true });
//     observe(this.#set, (...args) => this[Props.OnObserve](...args));
//     if (Array.isArray(data)) this.set(...data);
//     else if (data && 'toJSON' in data) this.set(...data.toJSON());
//   }
//
//   public subscribe(callback: (...args) => void) {
//     this.#callbacks.add(callback);
//     return this;
//   }
//
//   public unsubscribe(callback: (...args) => void) {
//     this.#callbacks.delete(callback);
//     return this;
//   }
//
//   public reinitialize(data: unknown[]) {
//     this.clear();
//     this.set(...data);
//   }
//
//   *[Symbol.iterator](): Generator<T> {
//     for (const item of this.#set) yield item;
//   }
//
//   public get size() {
//     return this.#set.size;
//   }
//
//   public get processed() {
//     return this.#processed;
//   }
//
//   protected get _keys(): ICollection.Keys {
//     return [['id']];
//   }
//
//   public set<N = true, B = T>(...args: any[]): ICollection.ListReturn<N, B> {
//     const result = [];
//     for (let item of args) {
//       this.#processed = item;
//       if (this.Item) item = (new this.Item(this) as any).initialize?.(item);
//       for (const key of this.#indexer(item)) {
//         if (this.#map.has(key))
//           throw new CollectionListItemAlreadyExistsError(this.constructor.name, key);
//         this.#map.set(key, item);
//       }
//       this.#processed = null;
//       this.#add(item);
//       result.push(item);
//     }
//     return result.length <= 1 ? result[0] : result;
//   }
//
//   public get<N = true, B = T>(...args): ICollection.ListReturn<N, B> {
//     let item;
//     const result = [];
//     for (const key of this.#indexer(args)) {
//       item = this.#map.get(key);
//       if (item && !~result.indexOf(item)) result.push(item);
//     }
//     return result.length ? (result.length > 1 ? result : result[0]) : false;
//   }
//
//   public has(...args) {
//     let item;
//     for (const key of this.#indexer(args)) {
//       item = this.#map.has(key);
//       if (item) return true;
//     }
//     return false;
//   }
//
//   public delete(...args) {
//     let isIndexed,
//       i,
//       items = this.get<false>(...args);
//     const reIndex = [];
//     if (!items) return false;
//     items = Array.isArray(items) ? items : [items];
//     for (const item of items) {
//       isIndexed = Props.Index in item;
//       this.#delete(item);
//       for (const key of this.#indexer(item)) this.#map.delete(key);
//     }
//     if (isIndexed) {
//       i = 0;
//       for (const item of this) {
//         item[Props.Index] = i++;
//         reIndex.push(item);
//       }
//       this.reinitialize(reIndex);
//     }
//     return true;
//   }
//
//   public clear() {
//     for (const item of this) this.#dispose(item);
//     this.#set.clear();
//     this.emit('cleared');
//     this.#map.clear();
//   }
//
//   public keys() {
//     return [...this.#map.keys()];
//   }
//
//   public getBy(criteria, all = false) {
//     const res: T[] = [];
//     if (Object.keys(criteria).length <= 0) return false;
//     for1: for (const item of this) {
//       for2: for (const field in criteria)
//         if (item[field] != criteria[field]) continue for1;
//       if (!all) return item;
//       res.push(item);
//     }
//     if (res.length) return res;
//     return false;
//   }
//
//   public toJSON() {
//     const result = [];
//     for (let item of this) result.push('toJSON' in item ? item['toJSON']() : item);
//     return result;
//   }
//
//   public toArray() {
//     return [...this];
//   }
//
//   #delete = (item) => {
//     this.#set.delete(item);
//     this.#dispose(item);
//     this.emit('deleted', item);
//   };
//
//   #dispose = (item) => item[Props.Disposer]();
//
//   #add = (item) => {
//     this.#set.add(item);
//     this.emit('added', item);
//     if (!(item instanceof Item))
//       Item.observe(item, (...args) => this[Props.OnObserve](...args));
//   };
//
//   [Props.OnObserve](...args) {
//     for (const callback of this.#callbacks) callback(...args);
//     this[Props.parent]?.[Props.OnObserve]?.();
//   }
//
//   #makeKey = (key, val) => key.map((k) => String(k)).join('.') + '|' + val.join('.');
//
//   #indexer = (item, result = [], key: any = this._keys) => {
//     if (Array.isArray(key[0])) {
//       for (const field of key) this.#indexer(item, result, field);
//     } else {
//       for (const k of key)
//         if (k === Props.Index && !(Props.Index in item)) item[Props.Index] = this.size;
//       result.push(
//         this.#makeKey(key, Array.isArray(item) ? item : key.map((k) => item[k])),
//       );
//     }
//     return result;
//   };
//
//   [Symbol.for('nodejs.util.inspect.custom')]() {
//     return this.toArray();
//   }
//
//   protected get Item(): IConstructor<T> | null {
//     return null;
//   }
// }
