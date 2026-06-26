# @biorate/config

Application configurator — hierarchical key-value store with string interpolation, references, and template expressions.

## Features

- **`get / has / set / merge`** — standard config API with dot-notation and array paths.
- **String interpolation** — `${path}` and `@{path}` placeholders resolve to other config values.
- **Link references** — `#{path}` points to an entire subtree.
- **RegExp templates** — `R{/pattern/flags}` creates `RegExp` objects at config runtime.
- **Function templates** — `F{args => body}` creates executable functions.
- **Empty value templates** — `!{object}`, `!{array}`, `!{void}`, `!{null}`, `!{string}` produce typed empty values.
- **Toggle per template type** — `Config.Template.*` flags enable/disable individual template processors.
- **Recursive templating** — `get()` resolves templates on read (not on merge), so circular-safe.

## Installation

```bash
pnpm add @biorate/config
```

Requires `@biorate/errors`, `@biorate/inversion`, `traverse`, `lodash-es` (peer).

## Quick start

```ts
import { Config } from '@biorate/config';

const config = new Config();

config.set('host', 'localhost');
config.set('port', 3000);
config.merge({ url: 'http://${host}:${port}/api' });

console.log(config.get<string>('url')); // 'http://localhost:3000/api'
console.log(config.has('host'));        // true
```

## Module reference

### `Config` — Main class

```ts
import { Config } from '@biorate/config';
```

Decorated with `@injectable()` for DI use.

#### Static members

| Member              | Signature                                      | Description                          |
|---------------------|------------------------------------------------|--------------------------------------|
| `Config.Template`   | `static Template: { string, link, regexp, function, empty }` | Toggle each template type (`true` by default). |

#### Instance members

| Member     | Signature                                               | Description                                           |
|------------|---------------------------------------------------------|-------------------------------------------------------|
| `get<T>`   | `get<T = unknown>(path, def?): T`                       | Resolves path. Throws `UndefinedConfigPathError` if no `def`. String/object values are template-resolved. |
| `has`      | `has(path): boolean`                                    | Checks if path exists in the data tree.               |
| `set`      | `set(path, value): void`                                | Sets a value at the path (creates intermediates).      |
| `merge`    | `merge(data): void`                                     | Deep merges data into the store via `lodash.merge`.    |

`path` is of type `PropertyPath = string | string[]` — dot-separated or array paths.

#### Template types

Configured per key by flag:

```ts
Config.Template.string = false;    // disable ${...} / @{...} interpolation
Config.Template.link = false;      // disable #{...} references
Config.Template.regexp = false;    // disable R{/pattern/}  
Config.Template.function = false;  // disable F{...} function creation
Config.Template.empty = false;     // disable !{...} empty values
```

### `IConfig` — Interface

```ts
import { IConfig } from '@biorate/config';
```

```ts
interface IConfig {
  get<T>(path: PropertyPath, def?: T): T;
  has(path: PropertyPath): boolean;
  set(path: PropertyPath, value: unknown): void;
  merge(data: unknown): void;
}
```

The contract used by DI consumers. `Config` implements `IConfig`.

### `IResult` — Template result type

```ts
import { IResult } from '@biorate/config';
```

```ts
type IResult = {
  value: string | RegExp | (() => unknown) | unknown[] | unknown | Record<string, unknown> | null | undefined;
};
```

Internal type representing the resolved value after a template processor runs.

### `UndefinedConfigPathError` — Error class

```ts
import { UndefinedConfigPathError } from '@biorate/config';
```

```ts
class UndefinedConfigPathError extends BaseError {
  constructor(path: PropertyPath);
}
```

Thrown by `config.get(path)` when a path does not exist and no default value is provided.

## Template reference

### String interpolation — `${...}` / `@{...}`

```ts
config.merge({
  protocol: 'https://',
  host: 'hostname.ru',
  path: 'main',
  url1: '${protocol}${host}/${path}',
  url2: '@{protocol}@{host}/@{path}',
});

config.get('url1'); // 'https://hostname.ru/main'
config.get('url2'); // 'https://hostname.ru/main'
```

Both `$` and `@` prefixes work identically. Supports recursion — templates within templates resolve iteratively.

### Link references — `#{...}`

```ts
config.merge({
  obj1: { a: 1, b: 2 },
  obj2: '#{obj1}',
});

config.get('obj2'); // { a: 1, b: 2 } — same object reference (via config lookup)
```

The entire value at the referenced path is injected.

### RegExp templates — `R{/pattern/flags}`

```ts
config.merge({
  regexp: 'R{/^test$/igm}',
});

const re = config.get<RegExp>('regexp');
console.log(re.test('test')); // true
```

Creates a `RegExpExt` instance (extends `RegExp` with custom `toJSON()`).

### Function templates — `F{args => body}`

```ts
config.merge({
  sum: 'F{a, b => return a + b;}',
});

const fn = config.get<(a: number, b: number) => number>('sum');
console.log(fn(1, 2)); // 3
```

Arguments are comma-separated, body follows `=>`.

### Empty templates — `!{type}`

| Template        | Result      |
|-----------------|-------------|
| `'!{object}'`   | `{}`        |
| `'!{array}'`    | `[]`        |
| `'!{void}'`     | `undefined` |
| `'!{null}'`     | `null`      |
| `'!{string}'`   | `""`        |
| `'!{ }'`        | `null`      |

## Architecture

```
Config implements IConfig
│
├── data: {}                         Internal object tree
├── Template (static flags)          Toggle processors
│
├── get(path, def?)
│   ├── lodash.get(data, path)
│   ├── if string → template(value)
│   │   ├── Template.string()        Replace ${...} / @{...}
│   │   ├── Template.link()          Replace #{...}
│   │   ├── Template.regexp()        Parse R{/.../}
│   │   ├── Template.function()      Parse F{...}
│   │   └── Template.empty()         Parse !{...}
│   ├── if object → templatize()     Recursive via traverse
│   └── throw UndefinedConfigPathError if missing and no def
│
├── has(path)                        lodash.has(data, path)
├── set(path, value)                 lodash.set(data, path, value)
└── merge(data)                      lodash.merge(data, data)
```

### Learn

- Documentation can be found here - [docs](https://biorate.github.io/core/modules/config.html).

### Release History

See the [CHANGELOG](https://github.com/biorate/core/blob/master/packages/%40biorate/config/CHANGELOG.md)

## License

[MIT](https://github.com/biorate/core/blob/master/packages/%40biorate/config/LICENSE)

Copyright (c) 2021-present [Leonid Levkin (llevkin)](mailto:llevkin@yandex.ru)
