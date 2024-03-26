import 'reflect-metadata';
import { injectable, addMetadata, container } from './inversify';
import { Metadata } from './labels';
import { lifecycled } from '@biorate/lifecycled';

export { injectable, inject, container } from './inversify';

export { Types } from './labels';

export { init, kill, on } from '@biorate/lifecycled';

// eslint-disable-next-line @typescript-eslint/ban-types
export function factory(Type: Object, Child: Object, Parent: Object, Root: Object) {
  addMetadata(Metadata.Factory, {}, null, Child);
  container.bind(Type).toFactory((context: any) => (...args: unknown[]) => {
    const item = context.container.get(Child);
    Reflect.defineMetadata(Metadata.Args, args, item);
    item.$promise = item.$run(container.get(Root), container.get(Parent));
    return item;
  });
}

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
