# @biorate/config-loader-vault

Config loader for HashiCorp Vault — reads secrets from Vault and merges into `IConfig` or downloads to filesystem with caching.

## Features

- **Two actions** — `merge` (load into config tree) and `download` (write files to disk).
- **Vault caching** — optionally cache Vault responses as JSON on disk to reduce API calls.
- **Config-driven** — options read from `IConfig` under the class name key.
- **Error resilience** — per-option `required` flag controls whether failure is fatal.
- **DI-ready** — extends `ConfigLoader`, injects `IVaultConnector`.

## Installation

```bash
pnpm add @biorate/config-loader-vault
```

Requires `@biorate/config`, `@biorate/config-loader`, `@biorate/errors`, `@biorate/inversion`, `@biorate/tools`, `@biorate/vault`.

## Quick start

```ts
import { inject, container, Types, Core } from '@biorate/inversion';
import { IConfig, Config } from '@biorate/config';
import { ConfigLoaderVault, ConfigLoaderVaultActions } from '@biorate/config-loader-vault';
import { VaultConnector } from '@biorate/vault';

class Root extends Core() {
  @inject(Types.Config) public config: IConfig;
  @inject(ConfigLoaderVault) public loader: ConfigLoaderVault;
}

container.bind<IConfig>(Types.Config).to(Config).inSingletonScope();
container.bind<VaultConnector>(VaultConnector).toSelf().inSingletonScope();
container.bind<ConfigLoaderVault>(ConfigLoaderVault).toSelf().inSingletonScope();

container.get<IConfig>(Types.Config).merge({
  Vault: [{ name: 'primary', options: { baseURL: 'http://localhost:8200', token: 'root' } }],
  ConfigLoaderVault: [
    { action: ConfigLoaderVaultActions.Merge, path: 'secret/data/config', connection: 'primary', cache: true },
  ],
});

(async () => {
  const root = container.get<Root>(Root);
  await root.$run();
  console.log(root.config.get('my-secret-key'));
})();
```

## Module reference

### `ConfigLoaderVault` — Main class

```ts
import { ConfigLoaderVault } from '@biorate/config-loader-vault';
```

Extends `ConfigLoader` (from `@biorate/config-loader`).

| Member              | Visibility    | Signature                                      | Description                       |
|---------------------|---------------|------------------------------------------------|-----------------------------------|
| `vault`             | `protected readonly` | `IVaultConnector`                        | Injected Vault connector.         |
| `initialize`        | `@init() protected` | `(): Promise<void>`                  | Read options from config, execute actions. |
| `read`              | `protected`   | `(option): Promise<Record<string, unknown>>`   | Read from cache or Vault.         |
| `cache`             | `protected`   | `(option, data): Promise<void>`               | Write JSON cache file.            |
| `[Merge]`           | `protected`   | `(data, option): Promise<void>`               | Merge data into config.           |
| `[Download]`        | `protected`   | `(data, option): Promise<void>`               | Merge + write files to disk.      |

### `ConfigLoaderVaultActions` — Enum

```ts
enum ConfigLoaderVaultActions {
  Merge = 'merge',
  Download = 'download',
}
```

### `IConfigLoaderVaultOption` — Option type

```ts
type IConfigLoaderVaultOption = {
  action: ConfigLoaderVaultActions;
  path: string;                             // Vault secret path
  connection: string;                       // Named Vault connection
  cache?: boolean;                          // Enable JSON cache (default false)
  directory?: string;                       // Download directory (default 'downloads')
  required?: boolean;                       // Fail on error (default true)
};
```

### Errors

| Error                                  | Condition                             |
|----------------------------------------|---------------------------------------|
| `ConfigLoaderVaultUnknownCacheError`   | Filesystem error during cache write (logged as warn). |

## Actions

### `Merge`

Reads JSON from Vault and calls `this.config.merge(data)`. The data becomes available in the central config tree.

### `Download`

Calls `config.merge(data)`, then for each key in `data` writes a file: `cwd/{directory}/{key}` with the stringified value.

## Architecture

```
ConfigLoaderVault extends ConfigLoader (@injectable)
│
├── @inject(Types.Vault) vault
│
└── @init() initialize()
    └── for each option in config.get('ConfigLoaderVault', [])
        ├── read(option)
        │   ├── if option.cache and cache file exists → return cached
        │   └── vault.connection(option.connection).read(option.path) → cache if enabled
        │
        └── switch (option.action)
            ├── Merge    → this.config.merge(data)
            └── Download → this.config.merge(data) + fs.writeFile for each key
```

### Learn

- Documentation can be found here - [docs](https://biorate.github.io/core/modules/config_loader_vault.html).

### Release History

See the [CHANGELOG](https://github.com/biorate/core/blob/master/packages/%40biorate/config-loader-vault/CHANGELOG.md)

## License

[MIT](https://github.com/biorate/core/blob/master/packages/%40biorate/config-loader-vault/LICENSE)

Copyright (c) 2021-present [Leonid Levkin (llevkin)](mailto:llevkin@yandex.ru)
