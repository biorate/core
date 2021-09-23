export function create(label) {
  return new Proxy(
    {},
    new (class {
      #map = new Map();
      #key = (name) => `${label}.${name}`;

      get(ctx: Record<string | symbol, any>, name: string) {
        const key = this.#key(name);
        let item = this.#map.get(key);
        if (!item) {
          item = Symbol(key);
          this.#map.set(key, item);
        }
        return item;
      }

      has(ctx: Record<string | symbol, any>, name: string) {
        return this.#map.has(this.#key(name));
      }
    })(),
  );
}

export const Types = create('Types');
export const Metadata = create('Metadata');
