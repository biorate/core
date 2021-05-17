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
      #key = (name) => `${label}.${name}`;

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
