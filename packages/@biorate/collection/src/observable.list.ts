import { List } from './list';
import { Props } from './symbols';
import { observable, observe } from 'mobx';

const _callbacks = Symbol('#callbacks');

/**
 * @description
 * This class inherits from [List](https://biorate.github.io/core/classes/collection.list.html) and implements the
 * [mobx](https://mobx.js.org/) observer interface nested over all object properties
 *
 * ### Features:
 * - observed over all objects and properties and all nested objects in collection
 *
 * @example
 * ```
 * import * as collection from '@biorate/collection';
 * const { embed, observable } = collection;
 *
 * class Item extends collection.ObservableItem {
 *   @observable() @embed(Item.Int) public id: number = null;
 *   @observable() @embed(Item.String) public text: string = null;
 * }
 *
 * class List extends collection.ObservableList<Item> {
 *   protected get _keys() {
 *     return [['id']];
 *   }
 *
 *   protected get _Item() {
 *     return Item;
 *   }
 * }
 *
 * const list = new List();
 * list.subscribe((data) => {
 *   console.log(data);
 *     // Called 3 times with data values:
 *     // {
 *     //   type: 'add',
 *     //   object: ObservableSet {...},
 *     //   newValue: Item { id: [Getter/Setter], text: [Getter/Setter] }
 *     // }
 *     // {
 *     //   type: 'update',
 *     //   object: Item { id: [Getter/Setter], text: [Getter/Setter] },
 *     //   oldValue: 'hello!',
 *     //   name: 'text',
 *     //   newValue: 'hello world!'
 *     // }
 *     // {
 *     //   type: 'delete',
 *     //   object: ObservableSet {...},
 *     //   oldValue: Item { id: [Getter/Setter], text: [Getter/Setter] }
 *     // }
 * });
 * list.set({ id: 1, text: 'hello!' });
 * list.find(1).text = 'hello world!';
 * list.delete(1);
 * ```
 */
export abstract class ObservableList<I = any, P = { parent?: any }> extends List<I, P> {
  /**
   * @description Callbacks storage
   */
  [_callbacks] = new Set<(...args: any[]) => void>();

  /**
   * @param items - initialization items
   * @param parent - parent item
   * @example
   * ```ts
   * import * as collection from '@biorate/collection';
   *
   * class List extends collection.ObservableList<{ id: number }> {
   *   protected get _keys() {
   *     return [['id']];
   *   }
   * }
   *
   * const list = new List([{ id: 1 }, { id: 2 }, { id: 3 }]);
   * ```
   */
  public constructor(items: any[] = [], parent: P = null) {
    super(items, parent);
    // @ts-ignore
    this._set = observable(this._set, { deep: false });
    observe(this._set, (...args) => this[Props.OnObserve](...args));
  }

  /**
   * @description Subscribe to changes
   * @example
   * ```ts
   * const list = new List([{ id: 1 }, { id: 2 }, { id: 3 }]);
   * const callback = (data) => console.log(data);
   * list.subscribe(callback);
   * ```
   */
  public subscribe(callback: (...args: any[]) => void) {
    this[_callbacks].add(callback);
    return this;
  }

  /**
   * @description Unsubscribe from changes
   * @example
   * ```ts
   * list.unsubscribe(callback);
   * ```
   */
  public unsubscribe(callback: (...args: any[]) => void) {
    this[_callbacks].delete(callback);
    return this;
  }

  [Props.OnObserve](...args) {
    for (const callback of this[_callbacks]) callback(...args);
    this.parent?.[Props.OnObserve]?.(...args);
  }
}
