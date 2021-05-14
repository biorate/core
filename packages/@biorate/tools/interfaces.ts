export namespace IDefine {
  export type Mods = '' | 'c' | 'w' | 'e' | 'cw' | 'we' | 'ce' | 'cwe';
  export type Accessor = { get?(): any; set?(v: any): void };
}
