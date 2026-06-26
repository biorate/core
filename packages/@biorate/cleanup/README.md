# @biorate/cleanup

Cleanup files and directories — recursive file/directory removal with glob pattern support and a CLI binary.

## Features

- **`cleanup()`** — remove files/directories matching one or more glob patterns.
- **Recursive + force** — uses `fs.promises.rm` with `{ recursive: true, force: true }`.
- **CLI binary** — `cleanup` command via npm `bin` entry point.
- **Error handling** — `ArgvEmptyListError` when no CLI arguments provided.

## Installation

```bash
pnpm add @biorate/cleanup
```

Requires `glob`, `minimist`.

## Module reference

### `cleanup` — Main function

```ts
import { cleanup } from '@biorate/cleanup';
```

| Export    | Signature                           | Description                                      |
|-----------|-------------------------------------|--------------------------------------------------|
| `cleanup` | `(...paths: string[]) => Promise<void>` | Expand glob patterns and remove matching files/directories. |

```ts
await cleanup('./dist/**', './temp', './*.log');
```

### Errors

| Export                   | Signature                                            | Description                    |
|--------------------------|------------------------------------------------------|--------------------------------|
| `ArgvEmptyListError`     | `class extends BaseError { constructor() }`          | Thrown when CLI argv is empty. |

### Interfaces

| Export          | Signature    | Description                     |
|-----------------|--------------|---------------------------------|
| `ICleanupArgs`  | `interface`  | Empty placeholder for future extension. |

## CLI usage

```bash
# Via npx:
npx @biorate/cleanup ./dist ./temp

# Via npm bin (if installed globally):
cleanup ./dist ./temp

# Via package.json script:
{
  "scripts": {
    "clean": "cleanup ./dist ./temp"
  }
}
```

The CLI parses `process.argv.slice(2)` via `minimist`. If no arguments are provided, it throws `ArgvEmptyListError`.

## Architecture

```
cleanup(...paths)
│
└── for each path:
    ├── glob.sync(path)           # expand glob patterns
    └── for each match:
        └── fs.promises.rm(match, { recursive: true, force: true })

CLI: bin/cleanup (Node shebang)
│
└── load cleanup-by-argv.ts
    ├── minimist(argv)
    ├── argv empty → throw ArgvEmptyListError
    └── cleanup(argv._)
```

### Learn

- Documentation can be found here - [docs](https://biorate.github.io/core/modules/cleanup.html).

### Release History

See the [CHANGELOG](https://github.com/biorate/core/blob/master/packages/%40biorate/cleanup/CHANGELOG.md)

## License

[MIT](https://github.com/biorate/core/blob/master/packages/%40biorate/cleanup/LICENSE)

Copyright (c) 2021-present [Leonid Levkin (llevkin)](mailto:llevkin@yandex.ru)
