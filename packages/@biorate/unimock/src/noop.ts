const EMPTY_ITERATOR: Iterator<unknown> = { next: () => ({ done: true, value: undefined }) };
const EMPTY_ASYNC_ITERATOR: AsyncIterator<unknown> = {
  next: () => Promise.resolve({ done: true, value: undefined }),
};

const TARGET_FN = function () {};

/**
 * @description Universal noop proxy — any property access, method call, `new` construct,
 *   or function application returns the `noop` itself. Never throws, never rejects.
 *
 *   Use as a drop-in mock for any dependency: `noop.db.query('SELECT 1')`, `noop.config.get('key')`,
 *   `await noop.asyncMethod()`, `for (const x of noop.items) {}`, `JSON.stringify(noop)`.
 *
 *   **Important:** `typeof noop` returns `'function'` because the Proxy target is a function.
 *   This is a JavaScript limitation (`typeof` is not interceptable by Proxy).
 *
 * @example
 * ```ts
 * import { noop } from '@biorate/unimock';
 *
 * const service = new Service(noop); // noop as any dependency
 * service.run();                     // noop methods called internally — no crash
 * ```
 */
const noopObject = new Proxy(TARGET_FN, {
  get(target, prop) {
    if (prop === 'then' || prop === 'constructor') return undefined;
    if (prop === 'toJSON') return () => ({});
    if (prop === Symbol.toPrimitive) return () => '';
    if (prop === Symbol.iterator) return () => EMPTY_ITERATOR;
    if (prop === Symbol.asyncIterator) return () => EMPTY_ASYNC_ITERATOR;
    if (prop in target) return (target as any)[prop];
    return noopObject;
  },
  has(_, prop) {
    if (prop === 'then' || prop === 'constructor') return false;
    return true;
  },
  ownKeys(target) {
    return Reflect.ownKeys(target);
  },
  getOwnPropertyDescriptor(target, prop) {
    return Reflect.getOwnPropertyDescriptor(target, prop);
  },
  deleteProperty() {
    return true;
  },
  set() {
    return true;
  },
  apply() {
    return noopObject;
  },
  construct() {
    return noopObject;
  },
}) as any;

export { noopObject as noop };
