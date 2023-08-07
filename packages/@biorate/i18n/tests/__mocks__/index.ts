import { use } from 'chai';
import { jestSnapshotPlugin } from 'mocha-chai-jest-snapshot';
import { inject, container, Core } from '@biorate/inversion';
import { I18n as I18nCommon } from '../../src';

use(jestSnapshotPlugin());

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
  @inject(I18n) public i18n: I18n;
}

container.bind<I18n>(I18n).toSelf().inSingletonScope();
container.bind<Root>(Root).toSelf().inSingletonScope();
