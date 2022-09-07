# File config loader

File-based config loader for [@biorate/config-loader](https://biorate.github.io/core/modules/config_loader.html)

### Features

- File config loader middleware
- Basic configuration in config.json
- Env-based configuration in config.{NODE_ENV}.json

### Examples

```
import { BaseConfigLoader, ILoaderConstructor } from '@biorate/config-loader';
import { ConfigLoaderFs } from '@biorate/config-loader-file';

export class ConfigLoader extends BaseConfigLoader {
  protected readonly loaders: ILoaderConstructor[] = [ConfigLoaderFs];
}
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
