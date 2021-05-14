export class One {}
export class Two extends One {}
export class Three extends Two {}
export const unsorted = { c: 1, a: 3, b: 2 };
export const sortedKeys = ['a', 'b', 'c'];
export const accessorGet = {
  _a: 0,

  get a() {
    return this._a;
  },
};
export const accessorSet = {
  _a: 0,

  set a(val) {
    this._a = val;
  },
};
