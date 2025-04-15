import { Axios, IStubParam } from './index';
import { Options } from './options';
import { AxiosError } from 'axios';

export class Stubs {
  static #cache = new WeakMap<typeof Axios, Stubs>();

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
    this.fetch.set(this.Class, this.Class.fetch);
    this.Class.fetch = async (options?: any) => {
      this.options.push(options);
      if (!persist) this.unstub();
      if (
        ['4', '5'].includes(String(status)[0]) ||
        instance?.validateStatus?.(status) === false
      )
        throw (
          params.error ?? new AxiosError('Internal Server Error', '500', params.config)
        );
      return { config: {}, headers: {}, statusText: '', status, ...params };
    };
  }

  public unstub() {
    if (!this.fetch.has(this.Class)) return;
    this.Class.fetch = this.fetch.get(this.Class)!;
  }
}
