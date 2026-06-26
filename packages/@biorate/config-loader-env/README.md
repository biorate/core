# @biorate/config-loader-env

Config loader for environment variables — loads `.env` files via `@dotenvx/dotenvx` and merges into `IConfig`.

## Features

- **Auto-merge** — reads `.env` and `.env.{ENV}` files, merges all `process.env` into config.
- **Override mode** — environment variables override existing config values.
- **ENV default** — sets `process.env.ENV = 'debug'` if not defined.
- **DI-ready** — extends `ConfigLoader`, decorated with `@injectable()`.

## Installation

```bash
pnpm add @biorate/config-loader-env
```

Requires `@biorate/config`, `@biorate/config-loader`, `@biorate/errors`, `@biorate/inversion`, `@dotenvx/dotenvx`.

## Quick start

```ts
import { inject, container, Types, Core } from '@biorate/inversion';
import { IConfig, Config } from '@biorate/config';
import { ConfigLoaderEnv } from '@biorate/config-loader-env';

class Root extends Core() {
  @inject(Types.Config) public config: IConfig;
  @inject(ConfigLoaderEnv) public loader: ConfigLoaderEnv;
}

container.bind<IConfig>(Types.Config).to(Config).inSingletonScope();
container.bind<ConfigLoaderEnv>(ConfigLoaderEnv).toSelf().inSingletonScope();
container.bind<Root>(Root).toSelf().inSingletonScope();

(async () => {
  const root = container.get<Root>(Root);
  await root.$run();
  console.log(root.config.get('MY_VAR')); // from .env or process.env
})();
```

## Module reference

### `ConfigLoaderEnv` — Main class

```ts
import { ConfigLoaderEnv } from '@biorate/config-loader-env';
```

Extends `ConfigLoader` (from `@biorate/config-loader`).

| Member              | Visibility    | Type / Signature                    | Description                         |
|---------------------|---------------|-------------------------------------|-------------------------------------|
| `dotenvxConfig`     | `protected`   | `DotenvConfigOptions`               | dotenvx options (paths, override).  |
| `initialize`        | `@init() protected` | `(): void`                   | Read .env files, merge into config. |

### Initialization flow

```
1. default-env.ts (side-effect)
   └── process.env.ENV = process.env.ENV ?? 'debug'

2. ConfigLoaderEnv.initialize()
   ├── dotenvx.config(dotenvxConfig)
   │   └── reads .env, .env.{ENV} into process.env
   └── this.config.merge(process.env)
       └── all env vars available via config.get()
```

Default dotenvx configuration:

```ts
{
  override: true,                         // env vars override existing values
  ignore: ['MISSING_ENV_FILE'],           // don't fail if .env missing
  path: ['.env', `.env.${process.env.ENV}`], // load .env, then .env.debug / .env.production
}
```

## Architecture

```
ConfigLoaderEnv extends ConfigLoader (@injectable)
│
├── [side-effect on import] default-env.ts
│   └── process.env.ENV ??= 'debug'
│
└── @init() initialize()
    ├── dotenvx.config(this.dotenvxConfig)
    │   ├── .env                  → process.env
    │   └── .env.{ENV}            → process.env (override)
    └── this.config.merge(process.env)
```

### Learn

- Documentation can be found here - [docs](https://biorate.github.io/core/modules/config_loader_env.html).

### Release History

See the [CHANGELOG](https://github.com/biorate/core/blob/master/packages/%40biorate/config-loader-env/CHANGELOG.md)

## License

[MIT](https://github.com/biorate/core/blob/master/packages/%40biorate/config-loader-env/LICENSE)

Copyright (c) 2021-present [Leonid Levkin (llevkin)](mailto:llevkin@yandex.ru)
