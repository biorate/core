# ENV config loader

ENV-based config loader for [@biorate/config-loader](https://biorate.github.io/core/modules/config_loader.html)

### Features

- ENV config loader middleware

### Examples

```
import { BaseConfigLoader, ILoaderConstructor } from '@biorate/config-loader';
import { ConfigLoaderEnv } from '@biorate/config-loader-env';

export class ConfigLoader extends BaseConfigLoader {
  protected readonly loaders: ILoaderConstructor[] = [ConfigLoaderEnv];
}
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
