/**
 * @description
 * Check object field to be getter or sestter
 * @param object - Object to search
 * @param field - Object field
 * @example
 * ```ts
 * import { object } from '@biorate/tools';
 *
 * const obj = {
 *   _value: 0,
 *
 *   get value() {
 *     return this._value;
 *   },
 *
 *   set value(value: number) {
 *     this._value = value;
 *   },
 * };
 *
 * console.log(object.isAccessor(obj, 'value')); // true
 * ```
 */
export function isAccessor(object: any, field: string) {
  const descriptor = Object.getOwnPropertyDescriptor(object, field);
  if (!descriptor) return false;
  return 'get' in descriptor || 'set' in descriptor;
}

/**
 * @description
 * Walk all object prototypes
 * @param object - Object to key-sort
 * @param callback - Callback on prototype walk
 * @example
 * ```ts
 * import { object } from '@biorate/tools';
 *
 * class A {}
 * class B extends A {}
 * class C extends B {}
 *
 * const c = new C();
 *
 * object.walkProto(c, console.log);
 * // C {}
 * // B {}
 * // A {}
 * ```
 */
export function walkProto(object: any, callback = (proto: any) => {}) {
  while (object) {
    object = Object.getPrototypeOf(object);
    if (!object || !('constructor' in object) || object.constructor === Object) break;
    callback(object);
  }
}

/**
 * @description
 * Recreate object with sorted keys
 * @param object - Object to key-sort
 * @example
 * ```ts
 * import { object } from '@biorate/tools';
 *
 * const obj = { b: 1, a: 2, d: 3, c: 4 };
 *
 * console.log(object.kSort(obj)); // { a: 2, b: 1, c: 3, d: 4 }
 * ```
 */
export function kSort(object: Record<string, unknown>) {
  return Object.keys(object)
    .sort()
    .reduce(
      (memo: Record<string, unknown>, item) => ((memo[item] = object[item]), memo),
      {},
    );
}
