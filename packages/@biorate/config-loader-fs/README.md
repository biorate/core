# File config loader

File-based config loader

### Features

- File config loader middleware
- Basic configuration in config.json
- Env-based configuration in config.{NODE_ENV}.json

### Examples

##### ./config.json
```
{
  "hello": "world"
}
```

##### ./index.ts
```
import { inject, container, Types, Core } from '@biorate/inversion';
import { IConfig, Config } from '@biorate/config';
import { ConfigLoader } from '@biorate/config-loader';
import { ConfigLoaderFs } from '@biorate/config-loader-fs';

class Root extends Core() {
  @inject(Types.Config) public config: IConfig;
  @inject(Types.ConfigLoaderFs) public configLoaderFs: ConfigLoader;
}

container.bind<IConfig>(Types.Config).to(Config).inSingletonScope();
container.bind<ConfigLoader>(Types.ConfigLoaderFs).to(ConfigLoaderFs).inSingletonScope();
container.bind<Root>(Root).toSelf().inSingletonScope();

(async () => {
  const root = container.get<Root>(Root);
  await root.$run();
  root.config.get('hello'); // world
})();
```

### See

[@biorate/config-loader docs](https://biorate.github.io/core/modules/config_loader.html) for details

### Learn

- Documentation can be found here - [docs](https://biorate.github.io/core/modules/config_loader_fs.html).

### Release History

See the [CHANGELOG](https://github.com/biorate/core/blob/master/packages/%40biorate/config-loader-fs/CHANGELOG.md)

### License

[MIT](https://github.com/biorate/core/blob/master/packages/%40biorate/config-loader-fs/LICENSE)

Copyright (c) 2021-present [Leonid Levkin (llevkin)](mailto:llevkin@yandex.ru)
