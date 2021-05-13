export function create(label) {
  return new Proxy(
    {},
    new (class {
      #map = new Map<string, symbol>();
      #key = (name) => `${label}.${name}`;

      get(ctx: { [key: string]: symbol }, name: string) {
        let key = this.#key(name),
          item = this.#map.get(key);
        if (!item) {
          item = Symbol(key);
          this.#map.set(key, item);
        }
        return item;
      }

      has(ctx: { [key: string]: symbol }, name: string) {
        return this.#map.has(this.#key(name));
      }
    })(),
  );
}
