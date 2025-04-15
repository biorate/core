/**
 * @description
 * Abstract singleton class
 *
 * @example
 * ```ts
 * import { Singleton } from '@biorate/singleton';
 *
 * class Test extends Singleton {
 *   public static get() {
 *     return this.instance<Test>();
 *   }
 * }
 *
 * const instance1 = Test.get();
 * const instance2 = Test.get();
 *
 * console.log(instance1 === instance2); // true
 * ```
 */
export abstract class Singleton {
  protected static cache = new WeakMap<typeof Singleton, Singleton>();

  protected static instance<T>() {
    if (!this.cache.has(this))
      // @ts-ignore - we'll only construct children
      this.cache.set(this, new this());
    return <T>this.cache.get(this)!;
  }

  protected constructor() {}
}
