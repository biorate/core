/**
 * @description Universal registry mapping class names to their constructors,
 * used on deserialization to restore recorded values with their real class
 * (so `instanceof` works in replay — e.g. for `error instanceof AxiosError`
 * or `result instanceof Money`). Pre-seeded with the built-in error classes;
 * consumers register their own classes once in test setup, e.g.
 * `registerClass('AxiosError', AxiosError)`. Unregistered names fall back to
 * the legacy behavior: generic `Error` for error entries, plain object for
 * everything else. The registry also gates serialization: only instances of
 * registered classes are written as `instance` entries (opt-in at record time).
 * */
type RegisteredCtor = abstract new (...args: never[]) => object;

const classRegistry = new Map<string, RegisteredCtor>([
  ['Error', Error],
  ['TypeError', TypeError],
  ['RangeError', RangeError],
  ['EvalError', EvalError],
  ['SyntaxError', SyntaxError],
  ['URIError', URIError],
]);

/**
 * @description Registers a class constructor under the given name. The name
 * must match `constructor.name` (or the recorded error's `name` for errors) as
 * it appears in the snapshot. Intended for test setup; re-registering the same
 * name replaces the previous entry.
 *
 * @param name - class name as it appears in recorded snapshots
 * @param ctor - the class constructor to restore on replay
 * */
export function registerClass(name: string, ctor: RegisteredCtor): void {
  classRegistry.set(name, ctor);
}

/** @description Looks up a registered class by name; `undefined` when unregistered. */
export function getClass(name: string): RegisteredCtor | undefined {
  return classRegistry.get(name);
}

/**
 * @description Removes a previously registered class. Built-in error classes
 * can also be removed, falling back to the legacy behavior on replay —
 * primarily useful for test isolation.
 * */
export function unregisterClass(name: string): void {
  classRegistry.delete(name);
}
