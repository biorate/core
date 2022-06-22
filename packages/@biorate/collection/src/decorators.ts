import { Props } from './symbols';
import { Ctor } from './types';
import { observable as o, action as a, computed as c } from 'mobx';

/**
 * @override See description [here](https://mobx.js.org/observable-state.html)
 */
export function observable() {
  return (target, field, ...args) => o(target, field, ...args);
}

/**
 * @override See description [here](https://mobx.js.org/actions.html)
 */
export function action() {
  return (target, field, descriptor) => a(target, field, descriptor);
}

/**
 * @override See description [here](https://mobx.js.org/computeds.html)
 */
export function computed() {
  return (target, field, descriptor) => c(target, field, descriptor);
}

/**
 * @description
 * Decorator that embed type of property in [Item](https://biorate.github.io/core/classes/collection.item.html) class*
 * @example
 * ```ts
 * import * as collection from '@biorate/collection';
 * const { embed } = collection;
 *
 * class Nested extends collection.Item {
 *   @embed(Item.Int) public int: number = null;
 *   @embed(Item.Float) public float: number = null;
 *   @embed(Item.String) public string: string = null;
 *   @embed(Item.Bool) public bool: boolean = null;
 * }
 * ```
 */
export function embed(type: any) {
  return (target, field: string) => {
    Reflect.defineMetadata(Props.Class, type, target, field);
  };
}

// export function inject(Class: Ctor) {
//   return (target, field: string) => {
//     target[field] = new Class();
//   };
// }

/**
 * @description
 * Decorator that realize singletone pattern
 * @example
 * ```ts
 * import { singleton } from '@biorate/collection';
 *
 * @singleton()
 * class Test {}
 *
 * const a = new Test();
 * const b = new Test();
 *
 * console.log(a === b); // true
 * ```
 */
export function singleton() {
  return (Class: any) =>
    new Proxy(
      Class,
      new (class {
        #instance = null;
        construct(target: Function, argumentsList: ArrayLike<any>, newTarget?: Function) {
          return (
            this.#instance ??
            (this.#instance = Reflect.construct(target, argumentsList, newTarget))
          );
        }
      })(),
    );
}

/**
 * @deprecated
 * @description
 * Backward capability
 */
export const singletone = singleton;
