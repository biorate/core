# @biorate/config-loader

Config loader abstraction — abstract base class for all config loaders in the `@biorate` DI ecosystem.

## Features

- **DI-ready** — decorated with `@injectable()`, injects `IConfig`.
- **Template Method pattern** — abstract `initialize()` must be implemented by subclasses.
- **Lifecycle integration** — `@init()` decorator from `@biorate/inversion` for automatic startup.

## Installation

```bash
pnpm add @biorate/config-loader
```

Requires `@biorate/config`, `@biorate/errors`, `@biorate/inversion`.

## Module reference

### `ConfigLoader` — Abstract base

```ts
import { ConfigLoader } from '@biorate/config-loader';
```

| Member       | Visibility    | Type / Signature                         | Description                   |
|--------------|---------------|------------------------------------------|-------------------------------|
| `config`     | `protected readonly` | `IConfig`                          | Injected config service.      |
| `initialize` | `protected abstract` | `(): Promise<void> \| void`       | Load config into `this.config`. |

## Usage pattern

```ts
import { injectable, init } from '@biorate/inversion';
import { ConfigLoader } from '@biorate/config-loader';

@injectable()
class EnvLoader extends ConfigLoader {
  @init()
  protected initialize() {
    this.config.merge({ env: process.env.NODE_ENV || 'development' });
  }
}
```

## Architecture

```
ConfigLoader (abstract, @injectable)
│
├── @inject(Types.Config) config: IConfig    Injected on construction
│
└── @init() initialize() [abstract]          Called by Core.$run()
    │
    └── subclass implements                  Reads/parses → config.merge()
```

### Learn

- Documentation can be found here - [docs](https://biorate.github.io/core/modules/config_loader.html).

### Release History

See the [CHANGELOG](https://github.com/biorate/core/blob/master/packages/%40biorate/config-loader/CHANGELOG.md)

## License

[MIT](https://github.com/biorate/core/blob/master/packages/%40biorate/config-loader/LICENSE)

Copyright (c) 2021-present [Leonid Levkin (llevkin)](mailto:llevkin@yandex.ru)
