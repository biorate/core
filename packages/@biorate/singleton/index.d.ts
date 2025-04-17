declare module '@biorate/singleton' {
  export abstract class Singleton {
    protected static cache: WeakMap<typeof Singleton, Singleton>;

    protected static instance<T>(): T;

    protected constructor() {}
  }
}
