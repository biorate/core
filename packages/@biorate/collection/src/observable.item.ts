import { Item } from './item';
import { Props } from './symbols';
import { observe } from 'mobx';

export class ObservableItem<P = { parent?: any }> extends Item<P> {
  /**
   * @description Callbacks storage
   */
  #callbacks = new Set<(...args: any[]) => void>();

  /**
   * @description Make structure - observable, catch error if it already observable
   */
  #observe = (object: Record<string, any>, callback: (data: Record<string, any>) => void) => {
    try {
      observe(object, callback);
    } catch {}
  };

  [Props.defineMapOrSet](
    field: string,
    items: any[],
    Ctor: { new (...args: any[]): any },
  ) {
    super[Props.defineMapOrSet](field, items, Ctor);
    this.#observe(this[field], (data: Record<string, any>) => this[Props.OnObserve](data, { name: field }));
  }

  /**
   * @override See description [here](/classes/collection.item.html#initialize)
   */
  public initialize(data: Record<string, any> = this[Props.data]) {
    const result = super.initialize(data);
    this.#observe(this, (data: Record<string, any>) => this[Props.OnObserve](data));
    return result;
  }

  /**
   * @description Subscribe to changes
   * @example
   * ```ts
   * const item = new Item().initialize({ int: 1 });
   * const callback = (data) => console.log(data);
   * item.subscribe(callback);
   * ```
   */
  public subscribe(callback: (...args: any[]) => void) {
    this.#callbacks.add(callback);
    return this;
  }

  /**
   * @description Unsubscribe from changes
   * @example
   * ```ts
   * item.unsubscribe(callback);
   * ```
   */
  public unsubscribe(callback: (...args: any[]) => void) {
    this.#callbacks.delete(callback);
    return this;
  }

  [Props.OnObserve](data: Record<string, any>, metadata: Record<string, any>) {
    for (const callback of this.#callbacks) callback({ ...data, ...metadata });
    this.parent?.[Props.OnObserve]?.(data, metadata);
  }
}
