import { ObservableItem, action } from '@biorate/collection';

export class Base<P = null> extends ObservableItem<P> {
  @action() set(data: Record<string, any>) {
    for (const field in data) if (field in this) this[field] = data[field];
    return this;
  }
}

export * from '@biorate/collection';
