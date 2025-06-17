import { AxiosError } from 'axios';
import { status as statuses } from 'http-status';
import { Axios, IStubParam } from './index';
import { Options } from './options';
import { FakeResponse } from './fake-response';

export class Stubs {
  static #cache = new WeakMap<typeof Axios, Stubs>();

  #halt = (
    statusText: string,
    status: number,
    params: IStubParam,
    response: FakeResponse,
  ) => {
    throw new AxiosError(
      statusText,
      String(status),
      params.config,
      params.headers,
      response,
    );
  };

  public static get(Class: typeof Axios) {
    if (!this.#cache.has(Class)) this.#cache.set(Class, new this(Class));
    return this.#cache.get(Class)!;
  }

  public readonly options: Options = new Options();

  protected fetch = new WeakMap<typeof Axios, typeof Axios.fetch>();

  protected constructor(protected Class: typeof Axios) {}

  public stub(
    instance: Axios & {
      validateStatus?: (status: number) => boolean;
    },
    params: IStubParam,
    persist = false,
  ) {
    const status = params?.status ?? 200;
    const statusText = String(statuses[<keyof typeof statuses>status] ?? statuses[500]);
    const response = new FakeResponse<typeof params.data>(
      params.data,
      status,
      statusText,
      params.headers ?? {},
      params.config ?? {},
    );
    this.fetch.set(this.Class, this.Class.fetch);
    this.Class.fetch = async (options?: any) => {
      this.options.push(options);
      if (!persist) this.unstub();
      if (instance?.validateStatus?.(status)) return response;
      if (['4', '5'].includes(String(status)[0]))
        this.#halt(statusText, status, params, response);
      return response;
    };
  }

  public unstub() {
    if (!this.fetch.has(this.Class)) return;
    this.Class.fetch = this.fetch.get(this.Class)!;
  }
}
