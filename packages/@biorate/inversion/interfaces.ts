import { interfaces } from 'inversify';

export interface IMetadata {
  key: symbol;
  value: unknown;
}

export type IService =
  | string
  | symbol
  | interfaces.Newable<any>
  | interfaces.Abstract<any>;
