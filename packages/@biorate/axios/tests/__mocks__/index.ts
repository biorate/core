import { Axios } from '../../src';
import { inject, container, Types } from '@biorate/inversion';
import { IConfig, Config } from '@biorate/config';

container.bind(Types.Config).to(Config).inSingletonScope();

export class Yandex extends Axios {
  @inject(Types.Config) public config: IConfig;
  // @ts-ignore
  public baseURL = this.config.get<string>('baseURL');
}

container.get<IConfig>(Types.Config).merge({
  baseURL: 'https://yandex.ru',
});
