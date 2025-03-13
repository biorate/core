import type { SuperTest, Test, Response } from 'supertest';

type Ctx = { _qs: Record<string, unknown>; _data: Record<string, unknown> };

const use =
  (log: (method: string, url: string, data: string) => unknown) => (ctx: Test) =>
    process.nextTick(() => {
      const { method, url } = ctx;
      // @ts-ignore
      const { _data }: Ctx = ctx;
      const data = JSON.stringify(_data);
      log(method, url, data);
    });

const response = (log: (status: number, body: string) => unknown) => (res: Response) =>
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
