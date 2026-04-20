import { inject, container, Core, Types } from '@biorate/inversion';
import { Config, IConfig } from '@biorate/config';
import { I18n as I18nCommon } from '../../src';

class I18n extends I18nCommon {
  protected options = {
    fallbackLng: 'ru',
    lng: 'ru',
    debug: false,
    resources: {
      ru: {
        translation: {
          'Привет мир': 'Привет мир!',
        },
      },
      en: {
        translation: {
          'Привет мир': 'Hello world!',
        },
      },
    },
  };
}

export class Root extends Core() {
  @inject(Types.Config) public config: IConfig;
  @inject(I18n) public i18n: I18n;
}

container.bind<IConfig>(Types.Config).to(Config).inSingletonScope();
container.bind<I18n>(I18n).toSelf().inSingletonScope();
container.bind<Root>(Root).toSelf().inSingletonScope();

export const root = container.get<Root>(Root);
