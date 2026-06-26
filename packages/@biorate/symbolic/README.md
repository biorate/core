# @biorate/symbolic

Symbols factory — isolated and global `Symbol` registries with lazy creation via `Proxy`.

## Features

- **`create(label)`** — creates an isolated namespace with lazy Symbol creation and caching.
- **`Global`** — global singleton registry backed by `Symbol.for()` with sub-namespace support.
- **Zero dependencies** — pure JS, no runtime libraries.
- **Type-safe** — full TypeScript declarations.

## Installation

```bash
pnpm add @biorate/symbolic
```

No runtime dependencies.

## Module reference

### `create(label)` — Isolated namespace factory

```ts
import { create } from '@biorate/symbolic';

const Namespace1 = create('Namespace1');
const Namespace2 = create('Namespace2');
```

Returns a `Proxy` object where every property access lazily creates and caches a unique `Symbol`.

| Export  | Signature                              | Description                                       |
|---------|----------------------------------------|---------------------------------------------------|
| `create`| `(label: string) => Record<string, symbol>` | Creates a new isolated symbol namespace.     |

**Behaviour:**

```ts
const A = create('A');
const B = create('B');

A.foo === A.foo;   // true  — cached within the same namespace
A.foo === B.foo;   // false — different namespaces are isolated
```

Internally uses `ES2020` private class fields (`#map`) and `Proxy.get` / `Proxy.has` traps.

### `Global` — Global singleton registry

```ts
import { Global } from '@biorate/symbolic';
```

A singleton `Proxy`-backed object that delegates to `Symbol.for()` for global symbol registration.

| Export   | Signature                                      | Description                                   |
|----------|------------------------------------------------|-----------------------------------------------|
| `Global` | `const Global: Proxify & { [key: string]: symbol }` | Global symbol registry via `Symbol.for()`. |

**Direct access:**

```ts
Global.Foo === Global.Foo;   // true — Symbol.for('Global.Foo')
Global.Foo === Global.Bar;   // false
```

**Namespaced access** (callable):

```ts
const MyNs = Global('MyNs');
MyNs.Test === MyNs.Test;     // true — Symbol.for('MyNs.Test')
```

The returned value is itself callable, allowing nested namespaces.

### Key differences

| Aspect              | `create(label)`         | `Global`                    |
|---------------------|-------------------------|-----------------------------|
| Backend             | `Symbol()` (local)      | `Symbol.for()` (global)     |
| Isolation           | Full — separate `Map`   | Global — shared across modules |
| Collision risk      | None between creates    | Possible if same key in different modules |
| Callable            | No                      | Yes — `Global('ns').Key`    |

## Usage patterns

### DI token isolation

```ts
import { create } from '@biorate/symbolic';

const Tokens = create('MyApp');
// Tokens.Logger, Tokens.Config, Tokens.Database — all unique Symbols
```

### Framework-level constants with Global

```ts
import { Global } from '@biorate/symbolic';

// In package A:
const Metadata = Global('Metadata');
export const Keys = Metadata;

// In package B:
import { Global } from '@biorate/symbolic';
Global('Metadata').Route === Global('Metadata').Route; // true
```

## Architecture

```
create(label)
│
└── new Proxy(target, handler)
    ├── Proxy.get(target, key)
    │   └── #map.has(key) ? #map.get(key) : (#map.set(key, Symbol(`${label}.${key}`)), #map.get(key))
    └── Proxy.has(target, key)
        └── #map.has(key)
```

```
Global
│
└── new Proxy(function(){}, Proxify)
    ├── Proxy.get(target, key)
    │   └── Symbol.for(`Global.${key}`)
    └── Proxy.apply(target, thisArg, [namespace])
        └── new Proxy({}, Proxify)  // with prefix = namespace
            └── get → Symbol.for(`${namespace}.${key}`)
```

### Learn

- Documentation can be found here - [docs](https://biorate.github.io/core/modules/symbolic.html).

### Release History

See the [CHANGELOG](https://github.com/biorate/core/blob/master/packages/%40biorate/symbolic/CHANGELOG.md)

## License

[MIT](https://github.com/biorate/core/blob/master/packages/%40biorate/symbolic/LICENSE)

Copyright (c) 2021-present [Leonid Levkin (llevkin)](mailto:llevkin@yandex.ru)
