export namespace IDefine {
  export type Mods = '' | 'c' | 'w' | 'e' | 'cw' | 'we' | 'ce' | 'cwe';
  export type Accessor = PropertyDescriptor & ThisType<any>;
}

export type IEventLike = {
  on: (event: string | symbol, callback: (...args: any[]) => void) => IEventLike;
  once: (event: string | symbol, callback: (...args: any[]) => void) => IEventLike;
};
