# Config loader

Config loader abstraction

### Features:

- Common interface for load configuration from different sources

### Examples:

##### ./config-loader-test

```
import { ILoader } from '@biorate/config-loader';
import { IConfig } from '@biorate/config';

export class ConfigLoaderTest implements ILoader {
  public async process(config: IConfig) {
    config.set('test', 'Hello world!');
  }
}
```

##### ./config-loader.ts

```
import { BaseConfigLoader, ILoaderConstructor } from '@biorate/config-loader';
import { ConfigLoaderTest } from './config-loader-test';

export class ConfigLoader extends BaseConfigLoader {
  protected readonly loaders: ILoaderConstructor[] = [ConfigLoaderTest];
}
```

##### ./index.ts

```
import { inject, container, Types, Core } from '@biorate/inversion';
import { IConfig, Config } from '@biorate/config';
import { IConfigLoader } from '@biorate/config-loader';
import { ConfigLoader } from './config-loader';

class Root extends Core() {
  @inject(Types.Config) public config: IConfig;
  @inject(Types.ConfigLoader) public configLoader: IConfigLoader;
}

container.bind<IConfig>(Types.Config).to(Config).inSingletonScope();
container.bind<IConfigLoader>(Types.ConfigLoader).to(ConfigLoader).inSingletonScope();
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
