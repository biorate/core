import 'reflect-metadata';
import { uniqBy } from 'lodash';
import { object as o, env } from '@biorate/tools';

enum Lifecircles {
  init,
  kill,
}

class Metadata {
  protected static metadata = Symbol.for('lifecircle.metadata');

  public static get(constructor): Set<{ key: number; field: string }> {
    return Reflect.getOwnMetadata(this.metadata, constructor);
  }

  public static add(constructor, key: number, field: string) {
    let items: Set<{ key: number; field: string }> = this.get(constructor);
    if (!items) items = new Set<{ key: number; field: string }>();
    items.add({ key, field });
    Reflect.defineMetadata(this.metadata, items, constructor);
  }
}

function decorator(type: number) {
  return () =>
    ({ constructor }, field: string) =>
      Metadata.add(constructor, type, field);
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
 * @lifecycled()
 * class Root {
 *   uno = new Uno();
 *   dos = new Dos();
 *   tres = new Tres();
 * }
 *
 * new Root();
 *
 * // Uno init
 * // Dos init
 * // Tres init
 * // Uno kill
 * // Dos kill
 * // Tres kill
 * ```
 */
export function lifecycled() {
  return (constructor: new (...args: unknown[]) => unknown) =>
    new Proxy(
      constructor,
      new (class {
        #processed = Symbol.for('lifecycled.processed');

        #check = (field: string, object: {}, parent = null) => {
          if (o.isAccessor(object, field)) return false;
          if (typeof object[field] !== 'object') return false;
          if (!object[field]) return false;
          if (!('constructor' in object[field])) return false;
          if (object[field] === object) return false;
          if (object[field] === parent) return false;
          return true;
        };

        #invoke = async (object: {}, parent = null) => {
          for (const field in object)
            if (this.#check(field, object, parent))
              await this.#invoke(object[field], object);
          await this.#call(object, parent);
        };

        #call = async (object: {}, parent = null) => {
          let items = [];
          if (Reflect.getMetadata(this.#processed, object)) return;
          Reflect.defineMetadata(this.#processed, true, object);
          o.walkProto(object, (object) => {
            const data = Metadata.get(object.constructor);
            if (data) items.push(...[...data]);
          });
          if (!items.length) return;
          items = uniqBy(items, 'field');
          await this.#apply(object, items);
        };

        #apply = async (object: {}, items: { key: number; field: string }[]) => {
          for (const item of items) {
            switch (item.key) {
              case Lifecircles.init:
                await object[item.field]();
                break;
              case Lifecircles.kill:
                env.isServer
                  ? require('async-exit-hook')(object[item.field].bind(object))
                  : env.globalThis.on('beforeunload', object[item.field].bind(object));
                break;
            }
          }
        };

        construct = (
          target: new (...args: unknown[]) => any,
          argumentsList: ArrayLike<unknown>,
          newTarget?: new (...args: unknown[]) => any,
        ) => {
          const instance = Reflect.construct(target, argumentsList, newTarget);
          this.#invoke(instance).catch(console.error);
          return instance;
        };
      })(),
    );
}

/**
 * @description init decorator
 * */
export const init = decorator(Lifecircles.init);

/**
 * @description kill decorator
 * */
export const kill = decorator(Lifecircles.kill);
