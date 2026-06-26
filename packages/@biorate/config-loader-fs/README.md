# @biorate/config-loader-fs

Config loader for filesystem — reads JSON configuration files from disk and merges into `IConfig` with environment-specific overrides.

## Features

- **Auto-load** — loads `package.json`, `config.json`, `config.{NODE_ENV}.json` on init.
- **Dynamic options** — additional files configurable via `ConfigLoaderFs` key inside `config.json`.
- **Namespace support** — each file can be merged under a namespace or at root level.
- **Custom root directory** — `ConfigLoaderFs.root()` for non-CWD projects.
- **Best-effort** — missing files log a warning, do not crash.

## Installation

```bash
pnpm add @biorate/config-loader-fs
```

Requires `@biorate/config`, `@biorate/config-loader`, `@biorate/errors`, `@biorate/inversion`, `@biorate/tools`.

## Quick start

```json
// config.json
{
  "app": { "port": 3000 },
  "ConfigLoaderFs": [
    { "file": "secrets.json", "namespace": "secrets" }
  ]
}
```

```ts
import { inject, container, Types, Core } from '@biorate/inversion';
import { IConfig, Config } from '@biorate/config';
import { ConfigLoaderFs } from '@biorate/config-loader-fs';

class Root extends Core() {
  @inject(Types.Config) public config: IConfig;
  @inject(ConfigLoaderFs) public loader: ConfigLoaderFs;
}

container.bind<IConfig>(Types.Config).to(Config).inSingletonScope();
container.bind<ConfigLoaderFs>(ConfigLoaderFs).toSelf().inSingletonScope();
container.bind<Root>(Root).toSelf().inSingletonScope();

(async () => {
  const root = container.get<Root>(Root);
  await root.$run();
  console.log(root.config.get('app.port')); // 3000
})();
```

## Module reference

### `ConfigLoaderFs` — Main class

```ts
import { ConfigLoaderFs } from '@biorate/config-loader-fs';
```

Extends `ConfigLoader` (from `@biorate/config-loader`).

| Member       | Visibility    | Type / Signature                             | Description                           |
|--------------|---------------|----------------------------------------------|---------------------------------------|
| `directory`  | `private static` | `string = process.cwd()`                  | Root directory for file loading.      |
| `root`       | `public static` | `(path: string) => typeof ConfigLoaderFs` | Set custom root directory (chainable).|
| `load`       | `protected`   | `(file, directory?, namespace?) => Promise<void>` | Read JSON file and merge into config. |
| `initialize` | `@init() protected` | `(): Promise<void>`                   | Load all configured files.            |

### `ConfigLoaderFsFileNotLoadedError` — Error

```ts
import { ConfigLoaderFsFileNotLoadedError } from '@biorate/config-loader-fs';
```

| Error                              | Condition                                    |
|------------------------------------|----------------------------------------------|
| `ConfigLoaderFsFileNotLoadedError` | JSON parse or file read fails (logged as warn). |

### `IConfigLoaderFsOption` — Dynamic option type

```ts
import { IConfigLoaderFsOption } from '@biorate/config-loader-fs';
```

```ts
type IConfigLoaderFsOption = {
  file: string;
  directory?: string;
  namespace?: string;
};
```

### Initialization order

```
initialize()
├── 1. load('package.json', undefined, 'package')     → namespace "package"
├── 2. load('config.json')                             → root level
├── 3. load(`config.${NODE_ENV || 'debug'}.json`)     → env-specific override
└── 4. for each option in config.get('ConfigLoaderFs', [])
      └── load(option.file, option.directory, option.namespace)
```

## Architecture

```
ConfigLoaderFs extends ConfigLoader (@injectable)
│
├── static directory: string                Default: process.cwd()
├── static root(path)                       Chainable setter
│
└── @init() initialize()
    ├── load('package.json')                namespace = 'package'
    ├── load('config.json')                 root merge
    ├── load(`config.${ENV}.json`)          env override
    └── for each in ConfigLoaderFs[]
        └── load(file, dir?, ns?)
            └── fs.readFile → JSON.parse → config.merge(data)
                └── on error → console.warn(...)
```

### Learn

- Documentation can be found here - [docs](https://biorate.github.io/core/modules/config_loader_fs.html).

### Release History

See the [CHANGELOG](https://github.com/biorate/core/blob/master/packages/%40biorate/config-loader-fs/CHANGELOG.md)

## License

[MIT](https://github.com/biorate/core/blob/master/packages/%40biorate/config-loader-fs/LICENSE)

Copyright (c) 2021-present [Leonid Levkin (llevkin)](mailto:llevkin@yandex.ru)
