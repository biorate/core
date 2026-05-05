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

export const validate =
  <T = Response>(schema: any, options?: Omit<IValidatorOptions, 'data' | 'schema'>) =>
  (data: any): Promise<T> =>
    Validator.validate({ data, schema, field: 'body', ...options });

export const exactly =
  <T = Response>(data: any, field = 'body') =>
  (result: any): T => {
    getExpect()(result[field]).toEqual(data);
    return result;
  };
