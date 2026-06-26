# @biorate/inversion

IoC container and DI framework built on InversifyJS, extended with automatic lifecycle management (`$run` / `$destroy`) via `@biorate/lifecycled`.

## Features

- **`@injectable()`** — marks a class for DI registration.
- **`@inject()`** — lazy property injection (supports `.multi`, `.named`, `.tagged`).
- **`Core()` mixin** — adds `$run()` / `$destroy()` lifecycle with logging.
- **`container`** — global InversifyJS `Container` singleton.
- **`Types.***` — shared symbolic type identifiers for cross‑package DI.
- **`@init()` / `@kill()`** — lifecycle decorators re‑exported from `@biorate/lifecycled`.
- **Async shutdown** — graceful process exit via `async-exit-hook`.

## Installation

```bash
pnpm add @biorate/inversion
```

Peer dependency: `reflect-metadata` (make sure `import 'reflect-metadata'` is called before any `@injectable()` usage).

## Quick start

```ts
import { Core, injectable, inject, container, kill, init } from '@biorate/inversion';

@injectable()
class Logger {
  @init() public initialize() {
    console.log('Logger ready');
  }

  public log(msg: string) { console.log(msg); }
}

@injectable()
class App {
  @inject(Logger) public logger: Logger;

  @init() public start() {
    this.logger.log('App started');
  }
}

class Root extends Core() {
  @inject(App) public app: App;
}

container.bind(Logger).toSelf().inSingletonScope();
container.bind(App).toSelf().inSingletonScope();
container.bind(Root).toSelf().inSingletonScope();

const root = container.get<Root>(Root);
await root.$run();
// Logger ready
// App started
// [Root] initialized [0.01s]

await root.$destroy();
```

## API Reference

### `Core()` mixin

```ts
function Core<T extends new (...args: any[]) => any>(Class?: T): typeof Core;
```

Creates an `@injectable()` class that extends `Class` (or an empty class) with:

| Method         | Description                           |
|----------------|---------------------------------------|
| `$run(root?)`  | Calls `lifecycled()` on the instance. |
| `$destroy()`   | Calls `lifecycled` kill phase.        |

```ts
class MyApp extends Core() { /* … */ }
// or
class MyApp extends Core(ExistingBase) { /* … */ }
```

### `@injectable()`

Class decorator. Equivalent to InversifyJS `@injectable()` plus metadata storage.

```ts
@injectable()
class MyService {}
```

### `@inject()`

Property decorator for lazy injection:

```ts
class Consumer {
  @inject(MyService) public service: MyService;
}
```

Variants:

```ts
@inject.multi(MyService)     // inject all bindings (array)
@inject.named(MyService, 'name')  // inject by named binding
@inject.tagged(MyService, 'tag', value) // inject by tagged binding
```

### `Types.*`

Shared `symbol` identifiers registered globally via `@biorate/symbolic`:

```ts
import { Types } from '@biorate/inversion';

container.bind(Types.Config).to(Config).inSingletonScope();
container.bind(Types.Logger).to(Logger).inSingletonScope();
```

### `container`

Global `Container` instance (skipBaseClassChecks enabled):

```ts
import { container } from '@biorate/inversion';

container.bind(Foo).toSelf();
container.bind(Bar).to(BarImpl);
```

### Lifecycle decorators (re‑exported)

| Decorator | Description            |
|-----------|------------------------|
| `@init()` | Marked method runs on `$run()`. |
| `@kill()` | Marked method runs on `$destroy()` / process exit. |

## Usage patterns

### DI with config

```ts
import { inject, Core, container, Types } from '@biorate/inversion';
import { IConfig, Config } from '@biorate/config';

@injectable()
class DbService {
  @inject(Types.Config) protected config: IConfig;

  public connect() {
    const url = this.config.get<string>('db.url');
    // …
  }
}

class Root extends Core() {
  @inject(DbService) public db: DbService;
}

container.bind(Types.Config).to(Config).inSingletonScope();
container.bind(DbService).toSelf().inSingletonScope();
container.bind(Root).toSelf().inSingletonScope();
```

### Custom logging

```ts
Core.log = {
  info: (msg: string) => myLogger.info(msg),
  warn: (msg: string) => myLogger.warn(msg),
};
```

### Multi‑injection

```ts
@injectable()
class Aggregate {
  @inject.multi(Plugin) public plugins: Plugin[];
}

container.bind(Plugin).to(PluginA);
container.bind(Plugin).to(PluginB);
```

### Named injection

```ts
@injectable()
class Cache {
  @inject.named(CacheAdapter, 'redis') public adapter: CacheAdapter;
}

container.bind(CacheAdapter).to(RedisAdapter).whenTargetNamed('redis');
```

## Architecture

```
                     ┌───────────────────────┐
                     │    inversify           │
                     │    Container            │
                     └──────────┬────────────┘
                                │
                ┌───────────────┴───────────────┐
                │        @biorate/inversion      │
                ├────────────────────────────────┤
                │ container (global singleton)    │
                │ Types.* (global symbols)        │
                │ injectable() decorator           │
                │ inject() / .multi / .named / .tagged │
                │ Core() mixin                     │
                │   └── $run() → lifecycled()     │
                │         @init / @kill scanning  │
                └────────────────────────────────┘
                                │
                    ┌───────────┴───────────┐
                    │   @biorate/lifecycled  │
                    │   topological scan     │
                    │   @init / @kill / @on  │
                    └───────────────────────┘
```

### Learn

- Documentation can be found here - [docs](https://biorate.github.io/core/modules/inversion.html).

### Release History

See the [CHANGELOG](https://github.com/biorate/core/blob/master/packages/%40biorate/inversion/CHANGELOG.md)

## License

[MIT](https://github.com/biorate/core/blob/master/packages/%40biorate/inversion/LICENSE)

Copyright (c) 2021-present [Leonid Levkin (llevkin)](mailto:llevkin@yandex.ru)
