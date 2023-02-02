import { Axios, IAxiosFetchOptions } from '../../src';
import { inject, container, Types } from '@biorate/inversion';
import { IConfig, Config } from '@biorate/config';
import { AxiosResponse } from 'axios';
import { set, get } from 'lodash';

export class Yandex extends Axios {
  public static store: Record<string, any> = {};

  @inject(Types.Config) public config: IConfig;
  // @ts-ignore
  public baseURL = this.config.get<string>('baseURL');
  public timeout = 1500;

  protected static getMock<T = any, D = any>(
    instance: Axios,
    options?: IAxiosFetchOptions,
  ): undefined | AxiosResponse<T, D> {
    return get(this.store, `${instance.constructor.name}.${JSON.stringify(options)}`);
  }

  protected static setMock<T = any, D = any>(
    instance: Axios,
    result: AxiosResponse<T, D>,
    options?: IAxiosFetchOptions,
  ) {
    set(this.store, `${instance.constructor.name}.${JSON.stringify(options)}`, result);
  }
}

container.bind(Types.Config).to(Config).inSingletonScope();

container.get<IConfig>(Types.Config).merge({
  baseURL: 'https://google.com',
});
