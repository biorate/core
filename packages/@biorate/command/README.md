# @biorate/command

Command executor common interface — abstract shell command execution with templating, sync/async modes, and Singleton pattern.

## Features

- **Abstract `CommonCommand`** — base class with templating, timing, and logging.
- **Sync / Async** — `CommonCommandSync` (blocking) and `CommonCommandAsync` (non-blocking).
- **Singleton** — extends `Singleton` from `@biorate/singleton`; `.execute()` is a static entry point.
- **Templating** — shell commands support `#{...}` / `${...}` interpolation from config.
- **Config accumulator** — merges defaults, instance params, call params, and exec options.
- **`format()` hook** — post-process command output.
- **Timing + logging** — `log()` hook logs status and duration.

## Installation

```bash
pnpm add @biorate/command
```

Requires `@biorate/config`, `@biorate/errors`, `@biorate/singleton`, `@biorate/tools`, `lodash-es` (peer).

## Quick start

```ts
import { CommonCommandSync } from '@biorate/command';

class Echo extends CommonCommandSync {
  protected command = ['echo', '#{value}'];
  protected get default() { return { value: 'hello' }; }
}

(async () => {
  const result = await Echo.execute({ value: 'world' });
  console.log(result.toString()); // 'world\n'
})();
```

## Module reference

### `CommandStatuses` — Enum

```ts
import { CommandStatuses } from '@biorate/command';
```

```ts
enum CommandStatuses {
  Completed = 'completed',
  Failed = 'failed',
}
```

### `CommandExecutionError` — Error

```ts
import { CommandExecutionError } from '@biorate/command';
```

```ts
class CommandExecutionError extends BaseError {
  constructor(command: string, e: Error);
}
```

Thrown when `exec`/`execSync` fails.

### `CommonCommand` — Abstract base

```ts
import { CommonCommand } from '@biorate/command';
```

Extends `Singleton`. Provides the shared infrastructure.

| Member            | Visibility    | Type / Signature                         | Description                            |
|-------------------|---------------|------------------------------------------|----------------------------------------|
| `.execute`        | `public static` | `(params?): Promise<Singleton>`       | Static entry: `instance().execute()`.  |
| `command`         | `protected abstract` | `string[]`                      | Shell command segments (joined by space). |
| `options`         | `protected`   | `ExecSyncOptions \| ExecOptions`         | Child process options.                 |
| `params`          | `protected`   | `Record<string, any>`                    | Default parameters for templating.     |
| `interpolate`     | `protected`   | `RegExp`                                 | Template regex (default: `/[#|$]{...}/g`). |
| `name`            | `protected get`| `string`                               | `this.constructor.name`.               |
| `default`         | `protected get`| `Record<string, unknown>`               | Default config values.                 |
| `execute`         | `protected`   | `(params?): Promise<Buffer \| string>`   | Resolve config, template, run, format. |
| `templatize`      | `protected`   | `(config): string`                       | Apply `lodash#template` interpolation on joined command. |
| `format`          | `protected`   | `(result): string \| Buffer`            | Post-process output (default: identity). |
| `log`             | `protected`   | `(status, time): void`                  | Log status and duration via `console.info`. |
| `exec`            | `protected abstract` | `(config): Promise<string \| Buffer>` | Execute the command.                   |

### `CommonCommandSync` — Synchronous execution

```ts
import { CommonCommandSync } from '@biorate/command';
```

Uses `child_process.execSync()` internally.

### `CommonCommandAsync` — Asynchronous execution

```ts
import { CommonCommandAsync } from '@biorate/command';
```

Uses `child_process.exec()` internally, wrapped in a Promise. Captures `stderr` (configurable via `stderr` property).

| Member    | Visibility  | Type      | Default | Description         |
|-----------|-------------|-----------|---------|---------------------|
| `stderr`  | `protected` | `boolean` | `true`  | Append stderr to stdout. |

## Usage patterns

### Custom async command

```ts
class Ping extends CommonCommandAsync {
  protected command = ['ping', '-c', '1', '#{host}'];
  protected options = { timeout: 5000 };
}

const result = await Ping.execute({ host: 'localhost' });
```

### Error handling

```ts
try {
  await FailCommand.execute();
} catch (e) {
  if (e instanceof CommandExecutionError) {
    console.error('Command failed:', e.message);
  }
}
```

## Architecture

```
CommonCommand extends Singleton
│
├── static execute(params)
│   └── instance<T>().execute(params)
│
├── protected execute(params)
│   ├── #config.clear()
│   ├── #config.merge(default)
│   ├── #config.merge(this.params)
│   ├── #config.merge(params)
│   ├── #config.merge({ $options: this.options })
│   ├── templatize(#config.all()) → command string
│   ├── exec(config) → execSync/exec
│   ├── format(result)
│   ├── log(status, duration)
│   └── return result
│
├── CommonCommandSync
│   └── exec(config) → execSync(...)
│
└── CommonCommandAsync
    └── exec(config) → exec(..., callback)
```

### Learn

- Documentation can be found here - [docs](https://biorate.github.io/core/modules/command.html).

### Release History

See the [CHANGELOG](https://github.com/biorate/core/blob/master/packages/%40biorate/command/CHANGELOG.md)

## License

[MIT](https://github.com/biorate/core/blob/master/packages/%40biorate/command/LICENSE)

Copyright (c) 2021-present [Leonid Levkin (llevkin)](mailto:llevkin@yandex.ru)
