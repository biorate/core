import { container, Types } from '@biorate/inversion';
import { IConfig, Config } from '@biorate/config';
import { AxiosResponse } from 'axios';
import { set, get } from 'lodash';
import { Axios, IAxiosFetchOptions } from '../../src';

export class Yandex extends Axios {
  public static store: Record<string, any> = {};

  public baseURL = this.config.get<string>('baseURL');

  public timeout = 1500;

  protected get config() {
    return <IConfig>container.get(Types.Config);
  }

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
