import { PropertyPath } from 'lodash';

export interface IConfig {
  get<T = unknown>(path: PropertyPath, def?: T): T;
  has(path: PropertyPath): boolean;
  set(path: PropertyPath, value: unknown): void;
  merge(data: unknown): void;
}

export type IResult = {
  value:
    | string
    | RegExp
    | (() => unknown)
    | unknown[]
    | Record<string, unknown>
    | null
    | undefined;
};
