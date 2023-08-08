# I18n

Internationalization library

#### Example:

```ts
import { inject, container, Core, Types } from '@biorate/inversion';
import { Config, IConfig } from '@biorate/config';
import { I18n as I18nCommon, t } from '@biorate/i18n';

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

(async () => {
  const root = container.get<Root>(Root);
  await root.$run();
  console.log(t`Привет мир`); // Привет мир!
  console.log(t(`Привет мир`, { lng: 'en' })); // Hello world!
})();
```

### Learn

- Documentation can be found here - [docs](https://biorate.github.io/core/modules/i18n.html).

### Release History

See the [CHANGELOG](https://github.com/biorate/core/blob/master/packages/%40biorate/i18n/CHANGELOG.md)

### License

[MIT](https://github.com/biorate/core/blob/master/packages/%40biorate/i18n/LICENSE)

Copyright (c) 2021-present [Leonid Levkin (llevkin)](mailto:llevkin@yandex.ru)
