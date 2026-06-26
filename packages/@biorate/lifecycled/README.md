# @biorate/lifecycled

Decorator‑driven async lifecycle manager for object trees. Recursively scans an object graph, discovers `@init` / `@kill` / `@on` decorated methods, and invokes them in topological order.

## Features

- **`@init()`** — async initializer; runs during `lifecycled(root)`.
- **`@kill()`** — async destructor; runs on `lifecycled` phase‑2 or process shutdown via `@biorate/shutdown-hook`.
- **`@on(event)`** — event handler binder (calls `object.on(event, handler)`).
- **Recursive scan** — walks all nested object properties (prototype‑aware, skips accessors, RegExp, self‑references, and already‑processed cycles).
- **Topological order** — deepest objects initialize first; destruct in reverse.
- **`processed` guard** — `Symbol.for('lifecycled.processed')` prevents double‑processing.
- **Event hooks** — `onInit` / `onKill` callbacks per object.

## Installation

```bash
pnpm add @biorate/lifecycled
```

Peer dependencies: `reflect-metadata`, `lodash-es`. Requires `@biorate/tools`, `@biorate/shutdown-hook`.

## Quick start

```ts
import { lifecycled, init, kill } from '@biorate/lifecycled';

class Database {
  @init() public async connect() {
    console.log('DB connected');
  }

  @kill() public async disconnect() {
    console.log('DB disconnected');
  }
}

class Server {
  @init() public async start() {
    console.log('Server started');
  }

  @kill() public async stop() {
    console.log('Server stopped');
  }
}

class App {
  db = new Database();
  server = new Server();
}

await lifecycled(new App());
// DB connected
// Server started
// Server stopped
// DB disconnected
```

## API Reference

### `lifecycled()` function

```ts
function lifecycled(
  root: object,
  onInit?: (object: object) => void,
  onKill?: (object: object) => void,
): Promise<object>;
```

Scans `root` and all nested objects for `@init` / `@kill` methods, invokes `@init` methods in topological order, registers `@kill` methods on `ShutdownHook` for process exit, and returns `root`.

### Decorators

| Decorator     | Target         | Behaviour                                              |
|---------------|----------------|--------------------------------------------------------|
| `@init()`     | Method         | Called during `lifecycled()` — async initializer.      |
| `@kill()`     | Method         | Called on process shutdown via `ShutdownHook` — async cleanup.|
| `@on(event)`  | Method         | Binds to `object.on(event, handler)` at scan time.     |

## Usage patterns

### Service tree

```ts
class Database {
  @init() public async connect() { /* … */ }
  @kill() public async close() { /* … */ }
}

class Cache {
  @init() public async warm() { /* … */ }
  @kill() public async flush() { /* … */ }
}

class Api {
  db = new Database();
  cache = new Cache();

  @init() public async start() { /* … */ }
}
```

### Child override via `override: true`

Children marked with `override: true` replace parent methods with the same lifecycle key:

*(Note: `override` and `undeclared` are metadata options passed to `@init` / `@kill` — see source for full details.)*

### Event binding with `@on`

```ts
class MyEmitter extends EventEmitter {
  @on('data') public handleData(payload: unknown) {
    console.log('data received', payload);
  }

  @on('error') public handleError(err: Error) {
    console.error('error', err);
  }
}

const emitter = new MyEmitter();
await lifecycled(emitter);
// lifecycled calls emitter.on('data', emitter.handleData)
// and emitter.on('error', emitter.handleError)
```

### Topological init order

```
┌──────────────────┐
│      App         │
├──────────────────┤
│ db: Database     │  ← @init()
│ cache: Cache     │  ← @init()
│                   │
│ @init() start()   │  ← runs AFTER db and cache
└──────────────────┘
```

Init order: `Database` → `Cache` → `App`. Kill order: `App` → `Cache` → `Database`.

### With logging callbacks

```ts
await lifecycled(app,
  (obj) => console.log(`✅ ${obj.constructor.name} initialized`),
  (obj) => console.log(`🛑 ${obj.constructor.name} destroyed`),
);
```

### Integration with `@biorate/inversion`

```ts
import { Core, container } from '@biorate/inversion';

class App extends Core() { /* … */ }
const app = container.get(App);
await app.$run(); // calls lifecycled internally
```

### Process shutdown

`@kill()` methods are automatically registered on `@biorate/shutdown-hook` and called when:

- `process.exit()` is called
- `SIGINT` / `SIGTERM` is received
- Unhandled rejection / exception

```ts
class Cleanup {
  @kill() public async shutdown() {
    await closeConnections();
    await flushLogs();
  }
}
```

## Architecture

```
lifecycled(root)
│
└── Lifecycled.process(root, onInit, onKill)
    │
    ├── 1. invoke(root)
    │       └── for each property:
    │           ├── skip: accessors, non-objects, null, RegExp, self, processed
    │           └── recurse: invoke(object[field], object)
    │       └── call(object)
    │           └── walkProto → collect Metadata (init/kill/on)
    │               └── apply() → queue init/kill, bind on-events
    │
    ├── 2. #init()
    │       └── for each queued init: await fn(); onInit(object)
    │
    └── 3. ShutdownHook.subscribe(#kill)
            └── for each queued kill: await fn(); onKill(object)

Metadata (Symbol.for('lifecircle.metadata'))
    ┌─────────────────────────────────────────┐
    │  { key: 0 (init), field, descriptor }    │
    │  { key: 1 (kill), field, descriptor }    │
    │  { key: 2 (on),   field, descriptor, event } │
    └─────────────────────────────────────────┘
    Stored per constructor via Reflect.defineMetadata.
```

### Learn

- Documentation can be found here - [docs](https://biorate.github.io/core/modules/lifecycled.html).

### Release History

See the [CHANGELOG](https://github.com/biorate/core/blob/master/packages/%40biorate/lifecycled/CHANGELOG.md)

## License

[MIT](https://github.com/biorate/core/blob/master/packages/%40biorate/lifecycled/LICENSE)

Copyright (c) 2021-present [Leonid Levkin (llevkin)](mailto:llevkin@yandex.ru)
