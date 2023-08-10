import { PropertyPath } from 'lodash';
import { BaseError } from '@biorate/errors';
import * as traverse from 'traverse';

declare module '@biorate/config' {
  export class Config {
    protected data: Record<string | symbol, unknown>;

    protected template(value: string): string;

    protected templatize(object: unknown): any;

    public get<T = unknown>(path: PropertyPath, def?: T): T;

    public has(path: PropertyPath): boolean;

    public set(path: PropertyPath, value: unknown): void;

    public merge(data: unknown): void;
  }

  export class UndefinedConfigPathError extends BaseError {
    public constructor(path: PropertyPath);
  }
}
