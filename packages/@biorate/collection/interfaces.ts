export namespace ICollection {
  export type Keys = (string | symbol)[][];
  export type Ctor<R = any> = { new (...args: any[]): R };
}
