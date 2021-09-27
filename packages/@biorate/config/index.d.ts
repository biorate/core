import { PropertyPath } from 'lodash';
import { BaseError } from '@biorate/errors';

declare module '@biorate/config' {
  export class Config {
    get<T = unknown>(path: PropertyPath, def?: T): T;
    has(path: PropertyPath): boolean;
    set(path: PropertyPath, value: unknown): void;
    merge(data: unknown): void;
  }

  export class UndefinedConfigPathError extends BaseError {
    constructor(path: PropertyPath);
  }
}
