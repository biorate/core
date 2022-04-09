import { Axios } from '../../src';
import { inject, container, Types } from '@biorate/inversion';
import { IConfig, Config } from '@biorate/config';

export class Yandex extends Axios {
  @inject(Types.Config) public config: IConfig;
  // @ts-ignore
  public baseURL = this.config.get<string>('baseURL');
}

container.bind(Types.Config).to(Config).inSingletonScope();

container.get<IConfig>(Types.Config).merge({
  baseURL: 'https://google.com',
});
