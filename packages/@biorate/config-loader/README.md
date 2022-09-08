# Config loader

Config loader abstraction

### Features:

- Common interface for load configuration from different sources

### Examples:

##### ./config-loader-test.ts
```
import { init } from '@biorate/inversion';
import { ConfigLoader } from '../../src';
import { key, value } from './';

export class ConfigLoaderTest extends ConfigLoader {
  @init() protected initialize() {
    this.config.set(key, value);
  }
}
```

##### ./index.ts
```
import { inject, container, Types, Core } from '@biorate/inversion';
import { IConfig, Config } from '@biorate/config';
import { ConfigLoader } from '@biorate/config-loader';
import { ConfigLoaderTest } from './config-loader-test';

class Root extends Core() {
  @inject(Types.Config) public config: IConfig;
  @inject(Types.ConfigLoaderTest) public configLoaderTest: ConfigLoader;
}

container.bind<IConfig>(Types.Config).to(Config).inSingletonScope();
container.bind<ConfigLoader>(Types.ConfigLoaderTest).to(ConfigLoaderTest).inSingletonScope();
container.bind<Root>(Root).toSelf().inSingletonScope();

container.get<IConfig>(Types.Config).merge({});

(async () => {
  const root = container.get<Root>(Root);
  await root.$run();
  root.config.get('test'); // Hello world!
})();
```

### Learn

- Documentation can be found here - [docs](https://biorate.github.io/core/modules/config_loader.html).

### Release History

See the [CHANGELOG](https://github.com/biorate/core/blob/master/packages/%40biorate/config-loader/CHANGELOG.md)

### License

[MIT](https://github.com/biorate/core/blob/master/packages/%40biorate/config-loader/LICENSE)

Copyright (c) 2021-present [Leonid Levkin (llevkin)](mailto:llevkin@yandex.ru)
