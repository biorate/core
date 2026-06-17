# @biorate/unimock

Snapshot-based proxy mocking for connectors and services.

Record real calls once, replay them later without live infrastructure. Ideal for integration tests that depend on databases, message brokers, HTTP APIs, or any other external service.

## How it works

`@Mockable()` extends the decorated class and replaces its prototype methods with wrappers. In **record** mode, each call passes through to the original implementation and the arguments + result are persisted into a JSON snapshot file. In **replay** mode, the wrappers return the recorded responses without invoking the original logic.

Connection objects returned by `.get()` or getter properties are automatically wrapped in a `MockHandler` (Proxy), so subsequent method calls on them are also recorded and replayed.

## Installation

```bash
pnpm add @biorate/unimock
```

## Usage

### Basic service mocking

```ts
import {
  Mockable,
  mock,
  SnapshotStore,
  flushAllSnapshots,
  isReplay,
  isRecord,
} from '@biorate/unimock';

class TestService {
  public async query(sql: string) {
    return { data: [1, 2, 3] };
  }
  public get value() {
    return 'real-value';
  }
}

// Record phase (needs live service)
SnapshotStore.setMode('record');

@Mockable()
class MockedService extends TestService {}

const service = new MockedService();
console.log(await service.query('SELECT 1')); // { data: [1, 2, 3] } — real call
flushAllSnapshots(); // writes tests/__snapshots__/MockedService.unimock.json

// Replay phase (no live service needed)
SnapshotStore.setMode('replay');

const replayed = new MockedService();
console.log(await replayed.query('SELECT 1')); // { data: [1, 2, 3] } — from snapshot
```

### Functional style

If you prefer not to use decorators, use `mock()` — it works identically to `@Mockable()`:

```ts
import { mock, SnapshotStore, flushAllSnapshots } from '@biorate/unimock';

class TestService {
  public async query(sql: string) {
    return { data: [1, 2, 3] };
  }
}

const MockedService = mock(TestService);

SnapshotStore.setMode('record');
const service = new MockedService();
console.log(await service.query('SELECT 1')); // { data: [1, 2, 3] } — real call
flushAllSnapshots();

SnapshotStore.setMode('replay');
const replayed = new MockedService();
console.log(await replayed.query('SELECT 1')); // { data: [1, 2, 3] } — from snapshot
```

### Static method wrapping

Some ORMs and frameworks expose operations as static methods (e.g. Sequelize `Model.findByPk()`). Use the `statics` option to wrap them for recording and replay.

```ts
import { Mockable, SEQUELIZE_STATICS } from '@biorate/unimock';

// Use a predefined list
@Mockable({ statics: [SEQUELIZE_STATICS] })
class TestModel extends Model {}
```

Each element in the `statics` array is a list of method names:

```ts
// Custom static methods
@Mockable({ statics: [['myMethod', 'another']] })
class MyService extends BaseService {}

// Combined
@Mockable({ statics: [SEQUELIZE_STATICS, ['myMethod']] })
class HybridModel extends Model {
  static myMethod() { ... }
}
```

Available static method lists:

| Export | Methods |
| ------ | ------- |
| `SEQUELIZE_STATICS` | `sync`, `drop`, `create`, `findOne`, `findAll`, `findByPk`, `findOrCreate`, `findOrBuild`, `findCreateFind`, `findAndCountAll`, `destroy`, `update`, `upsert`, `bulkCreate`, `truncate`, `restore`, `count`, `sum`, `min`, `max`, `increment`, `decrement`, `describe`, `scope`, `unscoped`, `schema`, `getTableName`, `addScope`, `removeAttribute`, `getAttributes`, `hasAlias`, `hasMany`, `belongsToMany`, `hasOne`, `belongsTo`, `build`, `bulkBuild`, `warnOnInvalidOptions` |

### Symbol serialization

By default, symbol values are serialized as a string marker (`'<symbol>'`). To preserve symbol identity across record/replay, enable the `symbols` option:

```ts
@Mockable({ symbols: true })
class MockedService extends RealService {}
```

When enabled, symbols are serialized as `{ t: 'symbol', v: '<description>' }` and restored via `Symbol(description)`. This is an opt-in feature because it changes the snapshot format and would break existing snapshots.

### Nested wrapping depth

By default, `MockHandler` recursively wraps any result with methods (e.g., a connection returned by `.get()`), and methods on that wrapper are also wrapped, and so on indefinitely. Use the `depth` option to limit this recursion:

```ts
// Decorator style
@Mockable({ depth: 2 })
class ShallowService extends RealService {}

// Functional style (identical)
const ShallowService = mock(RealService, { depth: 2 });
```

When the limit is reached, nested results are serialized directly as plain data instead of being wrapped in a `MockHandler`.

### Connector mocking (ClickHouse)

```ts
import { Core, inject, container, Types } from '@biorate/inversion';
import { IConfig, Config } from '@biorate/config';
import { Mockable, SnapshotStore, flushAllSnapshots } from '@biorate/unimock';
import { ClickhouseConnector as ChConnector } from '@biorate/clickhouse';

@Mockable()
class ClickhouseConnector extends ChConnector {}

class Root extends Core() {
  @inject(ClickhouseConnector) public connector: ClickhouseConnector;
}

container.bind<IConfig>(Types.Config).to(Config).inSingletonScope();
container.bind(ClickhouseConnector).toSelf().inSingletonScope();
container.bind(Root).toSelf().inSingletonScope();

container.get<IConfig>(Types.Config).merge({
  Clickhouse: [{ name: 'connection', options: {} }],
});

// Record
SnapshotStore.setMode('record');
const root = container.get<Root>(Root);
await root.$run();
const { data } = await root.connector
  .get()
  .query({ query: 'SELECT 1 AS result;', format: 'JSON' });
console.log(data); // [{ result: 1 }]
flushAllSnapshots();

// Replay (saved snapshot, no ClickHouse needed)
SnapshotStore.setMode('replay');
const { data: data2 } = await root.connector
  .get()
  .query({ query: 'SELECT 1 AS result;', format: 'JSON' });
console.log(data2); // [{ result: 1 }] — from snapshot
```

### Supported connectors

Unimock is connector-agnostic and works with any class that returns a connection object from a getter or a `.get()` method. The following connectors have integration tests:

- [ClickHouse](https://github.com/biorate/core/tree/master/packages/%40biorate/clickhouse)
- [Kafka (rdkafka)](https://github.com/biorate/core/tree/master/packages/%40biorate/rdkafka)
- [Schema Registry](https://github.com/biorate/core/tree/master/packages/%40biorate/schema-registry)
- [OpenSearch](https://github.com/biorate/core/tree/master/packages/%40biorate/opensearch)
- [MongoDB](https://github.com/biorate/core/tree/master/packages/%40biorate/mongodb)
- [Sequelize](https://github.com/biorate/core/tree/master/packages/%40biorate/sequelize)
- [PostgreSQL](https://github.com/biorate/core/tree/master/packages/%40biorate/pg)
- [MSSQL](https://github.com/biorate/core/tree/master/packages/%40biorate/mssql)
- [Redis / ioredis](https://github.com/biorate/core/tree/master/packages/%40biorate/redis)
- [Proxy](https://github.com/biorate/core/tree/master/packages/%40biorate/proxy)

## Environment

### Mode selection

| `UNIMOCK` | Behaviour |
| --------- | --------- |
| *(unset)* / `off` / `0` / `false` | Mocking disabled — `@Mockable()` is a no-op |
| `record` / `update` / `1` / `true` | Record mode — call real implementation, persist snapshots on flush |
| `replay` | Replay mode — return recorded responses; miss → `UnimockReplayMissError` |

### Mode helpers

Use `isReplay()` and `isRecord()` in application code to conditionally skip or adapt logic during tests:

```ts
import { isReplay, isRecord } from '@biorate/unimock';

if (isReplay()) {
  // skip infrastructure-dependent setup
}

if (!isRecord()) {
  // run cleanup only outside record mode
}
```

These functions always read the current global mode — they work correctly after `SnapshotStore.setMode()`. Also accessible via `Unimock.isReplay` and `Unimock.isRecord` getters.

### Optimisation flags

| Variable | Description |
| -------- | ----------- |
| `UNIMOCK_GZIP=1` | Gzip-compress snapshot files on write (~97 % reduction). Auto-detected on read. |
| `UNIMOCK_STRIP_REQUEST=1` | Strip the `request` field (Axios HTTP internals, ~40 KB per entry). |
| `UNIMOCK_SKIP_PROXY_ARGS=1` (or `UNIMOCK_SKIP_CONN_ARGS=1`) | Skip serialising `args` for `call:*` entries — they are not used in replay. |
| `UNIMOCK_SNAPSHOT_DIR` | Custom snapshot directory (default: `tests/__snapshots__`). |
| `SNAPSHOT_EXT` | Snapshot file extension (default: `.snap`). File name: `{ClassName}.unimock{ext}`. |

### Always-on optimisations

- **refId caching** — `WeakMap<object, string>` deduplicates `call:ref_X:method:hash` entries when the same connection object is returned by `.get()`.
- **String pool** — strings >500 B are moved to a shared dictionary (`strings:` key in the JSON file) and transparently expanded back on read.

## Vitest setup

```ts
// vitest.config.ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    setupFiles: ['@biorate/unimock/vitest/setup'],
  },
});
```

The setup hooks `afterAll` to call `flushAllSnapshots()` automatically when `UNIMOCK=record`.

## Scripts

```bash
# CI — replay committed snapshots, no live infrastructure
UNIMOCK=replay pnpm --filter @biorate/clickhouse test

# Re-record snapshots (needs live ClickHouse)
UNIMOCK=record pnpm --filter @biorate/clickhouse test

# With gzip compression and optimisations
UNIMOCK=record UNIMOCK_GZIP=1 UNIMOCK_STRIP_REQUEST=1 pnpm --filter @biorate/schema-registry test
```

## Snapshot file format

Snapshot files are stored in `tests/__snapshots__/<ClassName>.unimock.json`.

```json
{
  "version": 1,
  "className": "MockedService",
  "calls": {
    "query:a1b2c3d4": {
      "args": [{ "t": "string", "v": "SELECT 1" }],
      "result": { "t": "object", "v": [{ "k": "data", "v": { "t": "array", ... } }] }
    }
  },
  "strings": {
    "$0": "a very long repeated string..."
  }
}
```

## Known limitations

1. **`@init()` from `@biorate/lifecycled`** still runs in replay mode because the decorator stores the original descriptor in constructor metadata, not on the instance. Workaround: override `initialize` in the test subclass as a no-op, or check `SnapshotStore.mode` inside `initialize()`.

2. **MockHandler returns synchronously in replay mode.** In record mode, `query()` returns a Promise. In replay mode, it returns the deserialised value directly (await on a non-Promise works, but behaviour is not identical).

3. **Private `#` fields** are not wrapped — `wrapPrototype` and `MockHandler` filter keys starting with `#`.

### Learn
* Documentation can be found here - [docs](https://biorate.github.io/core/modules/unimock.html).

### Release History
See the [CHANGELOG](https://github.com/biorate/core/blob/master/packages/%40biorate/unimock/CHANGELOG.md)

### License
[MIT](https://github.com/biorate/core/blob/master/packages/%40biorate/unimock/LICENSE)

Copyright (c) 2021-present [Leonid Levkin (llevkin)](mailto:llevkin@yandex.ru)
