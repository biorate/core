/**
 * @description
 * Symbols factory registry with namespaces
 *
 * @example
 * ```ts
 * import { create } from '@biorate/symbolic';
 *
 * const Namespace1 = create('Namespace1');
 * const Namespace2 = create('Namespace2');
 *
 * // auto-create symbol on property call
 * console.log(Namespace1.Test1); // Symbol(Namespace1.Test)
 * console.log(Namespace1.Test1 === Namespace1.Test1); // true
 *
 * console.log(Namespace1.Test2); // Symbol(Namespace1.Test)
 * console.log(Namespace1.Test1 === Namespace1.Test2); // false
 *
 * // namespace isolation
 * console.log(Namespace2.Test1 === Namespace1.Test1); // false
 * ```
 */
export function create(label: string) {
  return new Proxy(
    {},
    new (class {
      #map = new Map<string, symbol>();
      #key = (name: string) => `${label}.${name}`;

      public get(ctx: { [key: string]: symbol }, name: string) {
        let key = this.#key(name),
          item = this.#map.get(key);
        if (!item) {
          item = Symbol(key);
          this.#map.set(key, item);
        }
        return item;
      }

      public has(ctx: { [key: string]: symbol }, name: string) {
        return this.#map.has(this.#key(name));
      }
    })(),
  );
}

/**
 * @description
 * Global symbols factory registry with namespaces
 *
 * @example
 * ```ts
 * import { Global } from '@biorate/symbolic';
 *
 * console.log(Global.Test); // Symbol(Global.Test)
 * console.log(Global.Test === Global.Test); // true
 *
 * // namespace usage
 * console.log(Global('Test').Test); // Symbol(Test.Test)
 * console.log(Global('Test').Test === Global('Test').Test); // true
 *
 * console.log(Global('Test1').Test); // Symbol(Test1.Test)
 * console.log(Global('Test2').Test); // Symbol(Test2.Test)
 * console.log(Global('Test1').Test === Global('Test2').Test); // false
 *
 * ```
 */
export const Global = (() => {
  class Proxify {
    #prefix: string;
    #key = (name: string) => `${this.#prefix}.${name}`;

    constructor(prefix = 'Global') {
      this.#prefix = prefix;
    }

    public get(ctx: Function & { [key: string]: symbol }, name: string) {
      return Symbol.for(this.#key(name));
    }

    // @ts-ignore
    public apply(
      target: Function & { [key: string]: symbol },
      thisArg: any,
      argumentsList: any[],
    ) {
      // @ts-ignore
      return new Proxy(function () {}, new Proxify(...argumentsList));
    }
  }
  // @ts-ignore
  return new Proxy(function () {}, new Proxify());
})();
