export namespace IDefine {
  export type Mods = '' | 'c' | 'w' | 'e' | 'cw' | 'we' | 'ce' | 'cwe';
  export type Accessor = {
    enumerable?: boolean;
    configurable?: boolean;
    get?: undefined | (() => unknown);
    set?: undefined | ((value: unknown) => unknown);
  };
}
