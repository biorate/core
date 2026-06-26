# @biorate/async-loop

Async loop function — runs a user-supplied async function on a fixed interval with pause/resume/stop controls.

## Features

- **Auto-start** — loop begins on construction.
- **Pause / Resume** — skip iterations without terminating the loop.
- **Stop** — permanent termination, breaks the infinite `while(true)`.
- **Error handling** — custom error handler (defaults to `console.error`).
- **Configurable interval** — delay between iterations in milliseconds.

## Installation

```bash
pnpm add @biorate/async-loop
```

Requires `@biorate/tools`.

## Quick start

```ts
import { AsyncLoop } from '@biorate/async-loop';

const loop = new AsyncLoop(
  async () => {
    console.log('tick');
  },
  (e) => console.error('error:', e),
  1000,
);

// After 5 iterations:
setTimeout(() => loop.stop(), 5000);
```

## Module reference

### `AsyncLoop` — Main class

```ts
import { AsyncLoop } from '@biorate/async-loop';
```

| Member      | Signature                                                      | Description                                        |
|-------------|----------------------------------------------------------------|----------------------------------------------------|
| `constructor` | `(process, error?, interval?)`                               | Start loop with callback, error handler, interval ms (default 1000). |
| `pause`     | `pause(): void`                                               | Skip `process()` on next and subsequent iterations (loop continues). |
| `resume`    | `resume(): void`                                              | Resume calling `process()` on next iteration.      |
| `stop`      | `stop(): void`                                                | Break out of the infinite loop permanently.        |
| `process`   | `protected async process(): Promise<void>`                    | Internal infinite loop — override in subclasses.   |

Constructor parameters:

| Parameter  | Type                              | Default          | Description               |
|------------|-----------------------------------|------------------|---------------------------|
| `process`  | `() => Promise<void> \| void`     | required         | Main iteration callback.  |
| `error`    | `(...e: any[]) => Promise<void> \| void` | `console.error` | Called if `process()` throws. |
| `interval` | `number`                          | `1000`           | Delay between iterations. |

## Usage patterns

### Polling with pause/resume

```ts
const poller = new AsyncLoop(async () => {
  const data = await fetch('/api/status');
  if (data.ready) poller.pause();
});
// later:
poller.resume();
```

### Custom subclass

```ts
class Heartbeat extends AsyncLoop {
  constructor() {
    super(() => this.beat(), console.error, 5000);
  }

  private async beat() {
    await fetch('/api/heartbeat');
  }
}
```

## Architecture

```
new AsyncLoop(process, error, interval)
│
└── constructor stores callbacks, calls this.process()
    │
    └── process() [protected]
        └── while (true)
            ├── await timer.wait(interval)    # setTimeout wrapper
            ├── if (#paused) continue         # skip iteration
            ├── if (#stoped) break            # permanent stop
            └── try { await process() }
                 catch { await error(e) }
```

### Learn

- Documentation can be found here - [docs](https://biorate.github.io/core/modules/async_loop.html).

### Release History

See the [CHANGELOG](https://github.com/biorate/core/blob/master/packages/%40biorate/async-loop/CHANGELOG.md)

## License

[MIT](https://github.com/biorate/core/blob/master/packages/%40biorate/async-loop/LICENSE)

Copyright (c) 2021-present [Leonid Levkin (llevkin)](mailto:llevkin@yandex.ru)
