import 'reflect-metadata';
import * as exitHook from 'async-exit-hook';
import { uniqBy } from 'lodash';
import { injectable, addMetadata, container } from './inversify';
import { Metadata } from './labels';
import { isGetterOrSetter, walkPrototype } from '@biorate/tools';

export function init() {
  return ({ constructor }, field: string, descriptor: PropertyDescriptor) =>
    addMetadata(Metadata.Init, { fn: descriptor.value }, field, constructor);
}

export function on(event) {
  return ({ constructor }, field: string, descriptor: PropertyDescriptor) =>
    addMetadata(Metadata.On, { fn: descriptor.value, event }, field, constructor);
}

export function kill() {
  return ({ constructor }, field: string, descriptor: PropertyDescriptor) =>
    addMetadata(Metadata.Kill, { fn: descriptor.value }, field, constructor);
}

export function factory(Type, Child, Parent, Root) {
  addMetadata(Metadata.Factory, {}, null, Child);
  container.bind(Type).toFactory((context: any) => (...args) => {
    const item = context.container.get(Child);
    Reflect.defineMetadata(Metadata.Args, args, item);
    item.$promise = item.$run(container.get(Root), container.get(Parent));
    return item;
  });
}

export function Core<T extends new (...any) => any>(Class?: T) {
  Class = Class ? Class : (class {} as unknown as T);
  @injectable()
  class Core extends Class {
    #initialize = [];
    #destructors = [];

    #onExit = async () => {
      for (const item of this.#destructors) {
        await item.fn();
        console.info(`[${item.object.constructor.name}] destructed!`);
      }
    };

    private static check(field: string, object, parent, root) {
      if (isGetterOrSetter(object, field)) return false;
      if (typeof object[field] !== 'object') return false;
      if (!object[field]) return false;
      if (!('constructor' in object[field])) return false;
      if (object[field] === object) return false;
      if (object[field] === root) return false;
      if (object[field] === parent) return false;
      return Reflect.getMetadata(Metadata.Module, object[field].constructor);
    }

    private applyMetadata(key, object, parent, root, data) {
      switch (key) {
        case Metadata.Init:
          this.#initialize.push({
            object,
            fn: data.fn.bind(
              object,
              ...(Reflect.getMetadata(Metadata.Args, object) ?? []),
            ),
          });
          return;
        case Metadata.Kill:
          this.#destructors.push({
            object,
            fn: data.fn.bind(object),
          });
          return;
        case Metadata.On:
          object.on(data.event, data.fn.bind(object));
          return;
      }
    }

    private call(object, parent, root) {
      let items = [];
      if (!('constructor' in object)) return;
      if (Reflect.getMetadata(Metadata.Metadata, object)) return;
      Reflect.defineMetadata(Metadata.Metadata, true, object);
      walkPrototype(object, (object) => {
        const data = Reflect.getOwnMetadata(Metadata.Metadata, object.constructor);
        if (data) items.push(...[...data]);
      });
      if (!items.length) return;
      items = uniqBy(items, 'field');
      for (const item of items)
        this.applyMetadata(item.key, object, parent, root, item.value);
    }

    private invoke(object: any = this, parent: any = null, root: Core = this) {
      for (const field in object) {
        if (!Core.check(field, object, parent, root)) continue;
        this.invoke(object[field], object, root);
      }
      this.call(object, parent, root);
    }

    public async $run(root = this, parent = null): Promise<this> {
      this.invoke(this, parent, root ? root : this);
      exitHook(this.#onExit);
      for (const item of this.#initialize) {
        await item.fn();
        console.info(`[${item.object.constructor.name}] initialized`);
      }
      return this;
    }

    public async $kill(root = this, parent = null): Promise<this> {
      await this.#onExit();
      return this;
    }
  }

  return Core;
}
