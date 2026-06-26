# @biorate/singleton

Abstract singleton class — provides a `WeakMap`-based per-subclass singleton pattern with lazy instantiation.

## Features

- **Per-subclass isolation** — each subclass gets its own instance in a `WeakMap` keyed by constructor.
- **Lazy instantiation** — instance created on first access via `instance<T>()`.
- **Protected constructor** — prevents direct instantiation outside the class hierarchy.
- **Zero dependencies** — pure JS, no runtime libraries.

## Installation

```bash
pnpm add @biorate/singleton
```

No runtime dependencies.

## Module reference

### `Singleton` — Abstract base

```ts
import { Singleton } from '@biorate/singleton';
```

Abstract class that provides singleton infrastructure.

| Member              | Visibility    | Signature                        | Description                          |
|---------------------|---------------|----------------------------------|--------------------------------------|
| `cache`             | `protected static` | `WeakMap<typeof Singleton, Singleton>` | One instance per concrete subclass. |
| `instance<T>`       | `protected static` | `<T>(): T`                      | Returns cached instance or creates via `new this()`. |
| `constructor`       | `protected`   | `constructor()`                  | Empty constructor, prevents external instantiation. |

**Usage contract:** Subclasses expose a public static delegating method:

```ts
class MyService extends Singleton {
  public static get() {
    return this.instance<MyService>();
  }
}
```

## Usage pattern

```ts
import { Singleton } from '@biorate/singleton';

class Config extends Singleton {
  private data = { host: 'localhost', port: 3000 };

  public static get() {
    return this.instance<Config>();
  }

  public getHost() {
    return this.data.host;
  }
}

const a = Config.get();
const b = Config.get();
console.log(a === b); // true
console.log(a.getHost()); // 'localhost'
```

## Architecture

```
Singleton (abstract)
│
├── protected static cache: WeakMap
│   └── key = subclass constructor
│   └── value = instance
│
└── protected static instance<T>()
    ├── cache.has(this) → return cached
    └── cache.set(this, new this()) → return new
```

### Learn

- Documentation can be found here - [docs](https://biorate.github.io/core/modules/singleton.html).

### Release History

See the [CHANGELOG](https://github.com/biorate/core/blob/master/packages/%40biorate/singleton/CHANGELOG.md)

## License

[MIT](https://github.com/biorate/core/blob/master/packages/%40biorate/singleton/LICENSE)

Copyright (c) 2021-present [Leonid Levkin (llevkin)](mailto:llevkin@yandex.ru)
