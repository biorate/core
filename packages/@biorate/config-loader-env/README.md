# ENV config loader

ENV-based config loader

### Features

- ENV config loader middleware

### Examples

```
import { inject, container, Types, Core } from '@biorate/inversion';
import { IConfig, Config } from '@biorate/config';
import { IConfigLoader } from '@biorate/config-loader';
import { ConfigLoaderEnv } from '@biorate/config-loader-env';

class Root extends Core() {
  @inject(Types.Config) public config: IConfig;
  @inject(Types.ConfigLoaderEnv) public configLoaderEnv: ConfigLoaderEnv;
}

container.bind<IConfig>(Types.Config).to(Config).inSingletonScope();
container.bind<ConfigLoader>(Types.ConfigLoaderEnv).to(ConfigLoaderEnv).inSingletonScope();
container.bind<Root>(Root).toSelf().inSingletonScope();

(async () => {
  const root = container.get<Root>(Root);
  await root.$run();
  root.config.get('test'); // Hello world!
})();
```

### See

[@biorate/config-loader docs](https://biorate.github.io/core/modules/config_loader.html) for details

### Learn

- Documentation can be found here - [docs](https://biorate.github.io/core/modules/config_loader_env.html).

### Release History

See the [CHANGELOG](https://github.com/biorate/core/blob/master/packages/%40biorate/config-loader-env/CHANGELOG.md)

### License

[MIT](https://github.com/biorate/core/blob/master/packages/%40biorate/config-loader-env/LICENSE)

Copyright (c) 2021-present [Leonid Levkin (llevkin)](mailto:llevkin@yandex.ru)
