export interface IMetadata {
  key: symbol;
  value: unknown;
}

export type Newable<T = any> = new (...args: any[]) => T;

export type AbstractNewable<T = any> = abstract new (...args: any[]) => T;

export type IService =
  | string
  | symbol
  | Newable<any>
  | AbstractNewable<any>;
