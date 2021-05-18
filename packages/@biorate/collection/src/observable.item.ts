import { Item } from './item';
import { Props } from './symbols';
import { observe } from 'mobx';

export class ObservableItem<P = { parent?: any }> extends Item<P> {
  #callbacks = new Set<(...args: any[]) => void>();

  [Props.defineMapOrSet](
    field: string,
    items: any[],
    Ctor: { new (...args: any[]): any },
  ) {
    super[Props.defineMapOrSet](field, items, Ctor);
    observe(this[field], (data) => this[Props.OnObserve](data, { name: field }));
  }

  public initialize(data: Record<string, any> = this[Props.data]) {
    const result = super.initialize(data);
    observe(this, (data) => this[Props.OnObserve](data));
    return result;
  }

  public subscribe(callback: (...args: any[]) => void) {
    this.#callbacks.add(callback);
    return this;
  }

  public unsubscribe(callback: (...args: any[]) => void) {
    this.#callbacks.delete(callback);
    return this;
  }

  [Props.OnObserve](data, metadata: Record<string, any>) {
    for (const callback of this.#callbacks) callback({ ...data, ...metadata });
    this.parent?.[Props.OnObserve]?.(data, metadata);
  }
}
