import { container, Types } from '@biorate/inversion';
import { IConfig, Config } from '@biorate/config';
import { AxiosPrometheus } from '../../src';

export { Prometheus } from '@biorate/prometheus';

export class Google extends AxiosPrometheus {
  public static logResult: { statusCode: number; startTime: [number, number] };
  public baseURL = this.config.get<string>('baseURL');
  public url = '/';
  public method = 'get';
  public timeout = 1500;

  protected log(statusCode: number, startTime: [number, number]) {
    Google.logResult = { statusCode, startTime };
    super.log(statusCode, startTime);
  }
}

container.bind(Types.Config).to(Config).inSingletonScope();

container.get<IConfig>(Types.Config).merge({
  baseURL: 'https://google.com',
});
