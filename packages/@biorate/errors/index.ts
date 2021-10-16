import { format } from 'util';

/**
 * @description
 * This module provides a base class for creating error classes with error code (class name),
 * message template, meta data support out of the box.
 *
 * @example
 * ```ts
 * import { BaseError } from '@biorate/errors';
 *
 * export class MyAwesomeError extends BaseError {
 *   constructor(args?: any[], meta?: any) {
 *     super(`Oops... Some error happen, at [%s], in [%s]`, args, meta);
 *   }
 * }
 *
 * const e = new MyAwesomeError([new Date(), 'core'], { hello: 'world!' });
 *
 * console.log(e.meta); // { hello: 'world!' }
 * console.log(e.code); // MyAwesomeError
 *
 * throw e;
 *           ^
 * MyAwesomeError: Oops... Some error happen, at [2021-05-13T09:19:22.511Z], in [core]
 *     at Object.<anonymous> (..core/packages/@biorate/errors/index.ts:28:11)
 *     at Module._compile (internal/modules/cjs/loader.js:1138:30)
 * ```
 */
export class BaseError extends Error {
  #meta: any = null;

  public constructor(
    message: string,
    args?: unknown[],
    meta?: unknown,
    ...options: unknown[]
  ) {
    // @ts-ignore: { cause } property added in 16.9.0
    super(format(message, ...(args || [])), ...options);
    this.#meta = meta;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }

  public get meta() {
    return this.#meta;
  }

  public get code() {
    return this.constructor.name;
  }
}
