import { List } from './list';
import { Props } from './symbols';
import { observable, observe } from 'mobx';

/**
 * @description
 * This class inherits from **List** and implements the
 * **mobx** observer interface nested over all object properties
 *
 * ### Features:
 * - observed over all objects and properties and all nested objects in collection
 *
 * @example
 * ```
 * import * as collection from '@biorate/collection';
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
 * class Item extends collection.ObservableItem {
 *   @observable() @embed(Item.Int) public id: number = null;
 *   @observable() @embed(Item.String) public text: string = null;
 * }
 *
 * const list = new List();
 * list.subscribe((data) => {
 *   console.log(data);
 *     // Called 3 times with data values:
 *     // {
 *     //   type: 'add',
 *     //   object: ObservableSet {...},
 *     //   newValue: Item1 { id: [Getter/Setter], text: [Getter/Setter] }
 *     // }
 *     // {
 *     //   type: 'update',
 *     //   object: Item1 { id: [Getter/Setter], text: [Getter/Setter] },
 *     //   oldValue: 'hello!',
 *     //   name: 'text',
 *     //   newValue: 'hello world!'
 *     // }
 *     // {
 *     //   type: 'delete',
 *     //   object: ObservableSet {...},
 *     //   oldValue: Item1 { id: [Getter/Setter], text: [Getter/Setter] }
 *     // }
 * });
 * list.set({ id: 1, text: 'hello!' }});
 * list.find(1).text = 'hello world!';
 * list.delete(1);
 * ```
 */
export abstract class ObservableList<I = any, P = { parent?: any }> extends List<I, P> {
  #callbacks = new Set<(...args: any[]) => void>();

  public constructor(items: any[] = [], parent: P = null) {
    super(items, parent);
    this._set = observable(this._set, { deep: false });
    observe(this._set, (...args) => this[Props.OnObserve](...args));
  }

  public subscribe(callback: (...args: any[]) => void) {
    this.#callbacks.add(callback);
    return this;
  }

  public unsubscribe(callback: (...args: any[]) => void) {
    this.#callbacks.delete(callback);
    return this;
  }

  [Props.OnObserve](...args) {
    for (const callback of this.#callbacks) callback(...args);
    this.parent?.[Props.OnObserve]?.(...args);
  }
}
