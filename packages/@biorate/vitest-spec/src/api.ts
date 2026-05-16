import type { SuperTest, Test, Response } from 'supertest';
import { IValidatorOptions } from './interfaces.js';
import { Validator } from './validator.js';

type Ctx = { _qs: Record<string, unknown>; _data: Record<string, unknown> };

const vitest = globalThis as any;
const getExpect = () => vitest.expect;

const use =
  (log: (method: string, url: string, data: string) => unknown) => (ctx: Test) =>
    process.nextTick(() => {
      const { method, url } = ctx;
      // @ts-ignore
      const { _data }: Ctx = ctx;
      const data = JSON.stringify(_data);
      log(method, url, data);
    });

const response =
  (log: (status: number, body: string) => unknown) =>
  (res: { status: number; text: string }) =>
    log(res.status, res.text);

/**
 * @description
 * Proxies a supertest instance to inject request/response logging via `logReq` and `logRes` callbacks.
 * Every HTTP call made through the returned proxy automatically fires the logging hooks.
 */
export const api = (
  request: SuperTest<Test>,
  logReq: (method: string, url: string, data: string) => unknown,
  logRes: (status: number, body: string) => unknown,
) =>
  new Proxy(request, {
    get(target, propertyKey, ...args) {
      if (!Reflect.has(target, propertyKey)) return;
      const method = Reflect.get(target, propertyKey, ...args);
      return (...args: any[]) =>
        method(...args)
          .on('response', response(logRes))
          .use(use(logReq));
    },
  });

/**
 * @description
 * Creates a validation middleware that validates response data against a class-validator schema
 * or a custom validation function.
 *
 * @example
 * ```ts
 * const res = await request.get('/users');
 * validate(UsersResponse)(res);
 * ```
 */
export const validate =
  <T = Response>(schema: any, options?: Omit<IValidatorOptions, 'data' | 'schema'>) =>
  (data: any): Promise<T> =>
    Validator.validate({ data, schema, field: 'body', ...options });

/**
 * @description
 * Creates a middleware that asserts a specific field of the response matches the expected data
 * (deep equality via `expect().toEqual`).
 *
 * @example
 * ```ts
 * const res = await request.get('/users');
 * exactly({ id: 1, name: 'Alice' })(res);
 * ```
 */
export const exactly =
  <T = Response>(data: any, field = 'body') =>
  (result: any): T => {
    getExpect()(result[field]).toEqual(data);
    return result;
  };
