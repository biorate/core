# Vault config loader

Vault config loader for [@biorate/config-loader](https://biorate.github.io/core/modules/config_loader.html)

### Features

- Vault config loader middleware

### Examples

```
import { BaseConfigLoader, ILoaderConstructor } from '@biorate/config-loader';
import { ConfigLoaderVault } from '@biorate/config-loader-vault';

export class ConfigLoader extends BaseConfigLoader {
  protected readonly loaders: ILoaderConstructor[] = [ConfigLoaderVault];
}
```

### See

[@biorate/config-loader docs](https://biorate.github.io/core/modules/config_loader.html) for details

### Learn

- Documentation can be found here - [docs](https://biorate.github.io/core/modules/config_loader_vault.html).

### Release History

See the [CHANGELOG](https://github.com/biorate/core/blob/master/packages/%40biorate/config-loader-vault/CHANGELOG.md)

### License

[MIT](https://github.com/biorate/core/blob/master/packages/%40biorate/config-loader-vault/LICENSE)

Copyright (c) 2021-present [Leonid Levkin (llevkin)](mailto:llevkin@yandex.ru)
