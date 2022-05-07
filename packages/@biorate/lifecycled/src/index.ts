import 'reflect-metadata';
import { uniqBy } from 'lodash';
import { object as o, env } from '@biorate/tools';

enum Lifecircles {
  init,
  kill,
  on,
}

class Metadata {
  protected static metadata = Symbol.for('lifecircle.metadata');

  public static get(
    constructor,
  ): Set<{ key: number; field: string; descriptor: PropertyDescriptor }> {
    return Reflect.getOwnMetadata(this.metadata, constructor);
  }

  public static add(
    constructor,
    key: number,
    field: string,
    descriptor: PropertyDescriptor,
    data?: Record<string, unknown>,
  ) {
    let items = this.get(constructor);
    if (!items) items = new Set();
    items.add({ ...data, key, field, descriptor });
    Reflect.defineMetadata(this.metadata, items, constructor);
  }
}

class Lifecycled {
  private static processed = Symbol.for('lifecycled.processed');
  private static initialized = Symbol.for('lifecycled.initialized');
  #initialize = new Map();
  #destructors = new Map();
  #onInitCb = (object: {}) => {};
  #onKillCb = (object: {}) => {};

  constructor(onInit = (object: {}) => {}, onKill = (object: {}) => {}) {
    this.#onInitCb = onInit;
    this.#onKillCb = onKill;
    env.isServer
      ? require('async-exit-hook')(this.#onKill)
      : env.globalThis.addEventListener('beforeunload', this.#onKill);
  }

  private check(field: string, object: {}, parent = null) {
    if (o.isAccessor(object, field)) return false;
    if (typeof object[field] !== 'object') return false;
    if (!object[field]) return false;
    if (!('constructor' in object[field])) return false;
    if (object[field] === object) return false;
    if (object[field] === parent) return false;
    return true;
  }

  private invoke(object: {}, parent = null) {
    for (const field in object)
      if (this.check(field, object, parent)) this.invoke(object[field], object);
    this.call(object, parent);
  }

  private call(object: {}, parent = null) {
    let items = [];
    if (Reflect.getMetadata(Lifecycled.processed, object)) return;
    Reflect.defineMetadata(Lifecycled.processed, true, object);
    o.walkProto(object, (object) => {
      const data = Metadata.get(object.constructor);
      if (data) items.push(...[...data]);
    });
    if (!items.length) return;
    items = uniqBy(items, 'field');
    this.apply(object, items);
  }

  private apply(
    object: { on?: (event: string, cb: () => {}) => {} },
    items: {
      key: number;
      field: string;
      descriptor: PropertyDescriptor;
      event?: string;
    }[],
  ) {
    for (const item of items) {
      switch (item.key) {
        case Lifecircles.init:
          this.#initialize.set(object, item.descriptor.value.bind(object));
          break;
        case Lifecircles.kill:
          this.#destructors.set(object, item.descriptor.value.bind(object));
          break;
        case Lifecircles.on:
          object.on(item.event, item.descriptor.value.bind(object));
          return;
      }
    }
  }

  #init = async () => {
    for (const [object, fn] of this.#initialize) {
      await fn();
      this.#onInitCb(object);
    }
  };

  #onKill = async () => {
    for (const [object, fn] of this.#destructors) {
      await fn.call(object);
      this.#onKillCb(object);
    }
  };

  public static async process(
    root: {},
    onInit = (object: {}) => {},
    onKill = (object: {}) => {},
  ) {
    const instance = new Lifecycled(onInit, onKill);
    instance.invoke(root);
    await instance.#init();
    return root;
  }
}

function decorator(type: number) {
  return (data?: Record<string, unknown>) =>
    ({ constructor }, field: string, descriptor: PropertyDescriptor) =>
      Metadata.add(constructor, type, field, descriptor, data);
}

/**
 * @description Decorator for entry point class
 *
 * @example
 * ```
 * import { lifecycled, init, kill } from '../../src';
 *
 * class Uno {
 *   @init() public initialize() {
 *     console.log('Uno init');
 *   }
 *
 *   @kill() public destructor() {
 *     console.log('Uno kill');
 *   }
 * }
 *
 * class Dos {
 *   @init() public initialize() {
 *     console.log('Dos init');
 *   }
 *
 *   @kill() public destructor() {
 *     console.log('Dos kill');
 *   }
 * }
 *
 * class Tres {
 *   @init() public initialize() {
 *     console.log('Tres init');
 *   }
 *
 *   @kill() public destructor() {
 *     console.log('Tres kill');
 *   }
 * }
 *
 * class Root {
 *   uno = new Uno();
 *   dos = new Dos();
 *   tres = new Tres();
 * }
 *
 * lifecycled(new Root());
 *
 * // Uno init
 * // Dos init
 * // Tres init
 * // Uno kill
 * // Dos kill
 * // Tres kill
 * ```
 */
export function lifecycled(
  root: {},
  onInit = (object: {}) => {},
  onKill = (object: {}) => {},
) {
  return Lifecycled.process(root, onInit, onKill);
}

/**
 * @description init decorator
 * */
export const init = decorator(Lifecircles.init);

/**
 * @description kill decorator
 * */
export const kill = decorator(Lifecircles.kill);

/**
 * @description on decorator - bind "on" event handler to object
 * */
export const on =
  (event: string) =>
  ({ constructor }, field: string, descriptor: PropertyDescriptor) =>
    Metadata.add(constructor, Lifecircles.on, field, descriptor, { event });
