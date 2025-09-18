import 'reflect-metadata';
import { lifecycled } from '@biorate/lifecycled';
import { injectable } from './inversify';

export { init, kill, on } from '@biorate/lifecycled';
export { injectable, inject, container } from './inversify';
export { Types } from './labels';

/**
 * @example
 * ```
 * import { Core, init, injectable, inject, container, kill } from '@biorate/inversion';
 *
 * @injectable()
 * class One {
 *   @init() public initialize() {
 *     console.log('One module initialized');
 *   }
 *
 *   @kill() public kill() {
 *     console.log('One module killed');
 *   }
 * }
 *
 * @injectable()
 * class Two {
 *   @init() public initialize() {
 *     console.log('Two module initialized');
 *   }
 * }
 *
 * @injectable()
 * class Three {
 *   @init() public initialize() {
 *     console.log('Three module initialized');
 *   }
 * }
 *
 * class Root extends Core() {
 *   @inject(One) public one;
 *   @inject(Two) public two;
 *   @inject(Three) public three;
 * }
 *
 * container.bind(One).toSelf();
 * container.bind(Two).toSelf();
 * container.bind(Three).toSelf();
 * container.bind(Root).toSelf();
 *
 * const root = container.get(Root);
 *
 * root.$run().then(() => {
 *   console.log(root.one instanceof One); // true
 *   console.log(root.two instanceof Two); // true
 *   console.log(root.three instanceof Three); // true
 * });
 * ```
 */
export function Core<T extends new (...any: any[]) => any>(Class?: T) {
  Class = Class ? Class : (class {} as unknown as T);

  @injectable()
  class Core extends Class {
    public async $run(root = this, parent = null) {
      const start = Date.now();
      await lifecycled(
        root ? root : this,
        (object) => {
          $Core.log?.info?.(
            `[${object.constructor.name}] initialized [${(
              (Date.now() - start) /
              1000
            ).toFixed(2)}s]`,
          );
        },
        (object) => {
          $Core.log?.info?.(`[${object.constructor.name}] destructed!`);
        },
      );
      return this;
    }
  }

  return Core;
}

Core.log = console;

const $Core = Core;
