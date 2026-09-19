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

> 💡 **Examples** — полные примеры интеграции по видам мокируемых зависимостей (что добавить в vitest setup и в `__mocks__/`): см. [`examples/`](examples/README.md).

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

@Mockable({ importMeta: import.meta })
class MockedService extends TestService {}

const service = new MockedService();
console.log(await service.query('SELECT 1')); // { data: [1, 2, 3] } — real call
flushAllSnapshots(); // writes tests/__snapshots__/MockedService.unimock.json (next to test file)

// Replay phase (no live service needed)
SnapshotStore.setMode('replay');

const replayed = new MockedService();
console.log(await replayed.query('SELECT 1')); // { data: [1, 2, 3] } — from snapshot
```

> 📚 Пример — [`examples/service-class.md`](examples/service-class.md).

### Functional style

If you prefer not to use decorators, use `mock()` — it works identically to `@Mockable()`:

```ts
import { mock, SnapshotStore, flushAllSnapshots } from '@biorate/unimock';

class TestService {
  public async query(sql: string) {
    return { data: [1, 2, 3] };
  }
}

const MockedService = mock(TestService, { importMeta: import.meta });

SnapshotStore.setMode('record');
const service = new MockedService();
console.log(await service.query('SELECT 1')); // { data: [1, 2, 3] } — real call
flushAllSnapshots();

SnapshotStore.setMode('replay');
const replayed = new MockedService();
console.log(await replayed.query('SELECT 1')); // { data: [1, 2, 3] } — from snapshot
```

> 📚 Пример — [`examples/service-class.md`](examples/service-class.md).

### Plain object mocking

`mock()` also accepts plain objects and class instances — every method is wrapped for record/replay:

```ts
import { mock, SnapshotStore, flushAllSnapshots } from '@biorate/unimock';

const obj = mock(
  {
    query: async (sql: string) => ({ data: [1, 2, 3] }),
  },
  { importMeta: import.meta },
);

// Record phase
SnapshotStore.setMode('record');
console.log(await obj.query('SELECT 1')); // { data: [1, 2, 3] } — real call
flushAllSnapshots();

// Replay phase
SnapshotStore.setMode('replay');
console.log(await obj.query('SELECT 1')); // { data: [1, 2, 3] } — from snapshot
```

> 📚 Пример — [`examples/plain-object.md`](examples/plain-object.md).

The snapshot name is auto-derived: `constructor.name` for class instances, or `Object_<hash>` for literals. Use `name` in options to override:

```ts
const obj = mock(service, { name: 'MyService', importMeta: import.meta });
```

The original object is not mutated — a copy is returned.

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

| Export              | Methods                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `SEQUELIZE_STATICS` | `sync`, `drop`, `create`, `findOne`, `findAll`, `findByPk`, `findOrCreate`, `findOrBuild`, `findCreateFind`, `findAndCountAll`, `destroy`, `update`, `upsert`, `bulkCreate`, `truncate`, `restore`, `count`, `sum`, `min`, `max`, `increment`, `decrement`, `describe`, `scope`, `unscoped`, `schema`, `getTableName`, `addScope`, `removeAttribute`, `getAttributes`, `hasAlias`, `hasMany`, `belongsToMany`, `hasOne`, `belongsTo`, `build`, `bulkBuild`, `warnOnInvalidOptions` |

> 📚 Пример (включая offline-биндинг моделей в replay — обход `ModelNotInitializedError`) — [`examples/static-methods.md`](examples/static-methods.md).

#### Replay reconstruction of model instances

In replay mode, the recorded result of a static that returns model instances is reconstructed into real model instances (with working `toJSON()`, `get()`, `save()`, etc.) by the model's own **original** static `build(plain, { isNewRecord: false })`, captured before wrapping. The result shape determines how the recorded data is rebuilt:

**Constructor-internal pass-through (1.10.1).** While the original `build` is running, the vanilla constructor may re-enter the model's own wrapped prototype methods (e.g. Sequelize `_initValues`). Those inner calls are **not** looked up in the snapshot store — they pass through to the original implementations, and instance state is populated by the model's own constructor. This means the construction options seen in record mode (hydration: `raw: true, attributes: [...]`) and in replay (reconstruction: `{ isNewRecord: false }`) **do not need to match**, and seeding a `build()` call with identical args is no longer required. Post-construction calls (`toJSON()`, `get()`, …) are served from the recorded per-instance `call:{refId}:` entries.

| Statics                                                   | Replayed result                                                             |
| --------------------------------------------------------- | --------------------------------------------------------------------------- |
| `create`, `findOne`, `findByPk`, `build`                  | a single model instance                                                     |
| `findAll`, `bulkCreate`, `bulkBuild`                      | an array of model instances                                                 |
| `findOrCreate`, `findOrBuild`, `findCreateFind`, `upsert` | an `[instance, created]` pair                                               |
| `update`                                                  | a `[count, instances]` pair                                                 |
| `findAndCountAll`                                         | `{ count, rows: instances }`                                                |
| `scope`, `unscoped`, `schema`                             | the model class itself, so chaining like `Model.scope('x').findAll()` works |

Unknown or custom statics keep the legacy behaviour: the recorded result is deserialized as plain data. Instance methods called on reconstructed instances are replayed with per-instance call keys (`call:{refId}:...`), so each row of a multi-row result returns its own data.

### Symbol serialization

By default, symbol values are serialized as a string marker (`'<symbol>'`). To preserve symbol identity across record/replay, enable the `symbols` option:

```ts
@Mockable({ symbols: true })
class MockedService extends RealService {}
```

> 📚 Пример — [`examples/options.md`](examples/options.md).

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

> 📚 Пример — [`examples/options.md`](examples/options.md).

When the limit is reached, nested results are serialized directly as plain data instead of being wrapped in a `MockHandler`.

### Callback arguments

Functions passed as arguments to mocked methods are intercepted: their invocations are recorded in record mode and replayed in replay mode.

> 📚 Пример — [`examples/callbacks.md`](examples/callbacks.md).

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

> 📚 Пример — [`examples/connector.md`](examples/connector.md).

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

| `UNIMOCK`                          | Behaviour                                                                                                                                                                                                 |
| ---------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| _(unset)_ / `off` / `0` / `false`  | Mocking off — **zero-overhead pass-through**: wrapped calls go straight to the original implementation without any argument hashing or call-key computation; nothing is read from or written to snapshots |
| `record` / `update` / `1` / `true` | Record mode — call real implementation, persist snapshots on flush                                                                                                                                        |
| `replay`                           | Replay mode — return recorded responses; miss → `UnimockReplayMissError`                                                                                                                                  |

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

> 📚 Setup для vitest, режимы, флаги и контракт снапшотов — [`examples/setup.md`](examples/setup.md).

### Mode contract and snapshot lifecycle (Контракт режимов и жизненный цикл снапшотов)

Snapshot files follow a strict mode contract. It is enforced at three levels: the `@Mockable()` wrappers (they never touch the store outside record mode), the store API itself, and the contract tests (`tests/mode-guards.spec.ts`, `tests/record-session.spec.ts`).

1. **Only record mode writes.** `SnapshotStore.record()` and `store.flush()` are no-ops outside record mode (defense in depth: the wrappers already skip them, and the guards also cover direct API calls). `flushAllSnapshots()` is guarded the same way.

2. **A record session starts from a clean slate.** In record mode the store constructor does not load an existing snapshot file, and the first `flush()` of a session rewrites the file in full (truncate + rewrite). Cross-session duplicate `_t:'c'` lines for the same call key are therefore impossible. The transition into record, for example `setMode('replay')` followed by `setMode('record')`, sweeps every cached store: in-memory calls, pools and pending buffers are reset, so the next flush rewrites the file again. Repeating `setMode('record')` while already in record mode does **not** sweep, the current session stays intact.

3. **Replay and off physically cannot change snapshot files.** Neither mode creates, appends to, or truncates anything. A replay run against committed snapshots leaves them byte-for-byte identical.

**Edge case: an unflushed session leaves the file stale.** Snapshot data lives in memory until `flush()` runs (the vitest setup calls `flushAllSnapshots()` for you in an `afterAll` hook). If a record session ends without a single flush, the old file stays on disk untouched and still holds the previous session's content.

**Parallel safety convention.** One snapshot file belongs to exactly one record session at a time. Keep `className` + snapshot directory unique per spec file, or let each spec record into its own `mkdtempSync` directory. Under this convention concurrent record sessions never write the same file. Concurrent replay runs are safe by construction since replay never writes.

### Optimisation flags

| Variable                                                    | Description                                                                                               |
| ----------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| `UNIMOCK_GZIP=1`                                            | Gzip-compress snapshot files on write (~97 % reduction). Auto-detected on read.                           |
| `UNIMOCK_STRIP_REQUEST=1`                                   | Strip the `request` field (Axios HTTP internals, ~40 KB per entry).                                       |
| `UNIMOCK_SKIP_PROXY_ARGS=1` (or `UNIMOCK_SKIP_CONN_ARGS=1`) | Skip serialising `args` for `call:*` entries — they are not used in replay.                               |
| `UNIMOCK_SNAPSHOT_DIR`                                      | Custom snapshot directory fallback (default: `tests/__snapshots__`). Ignored when `importMeta` is passed. |
| `SNAPSHOT_EXT`                                              | Snapshot file extension (default: `.snap`). File name: `{ClassName}.unimock{ext}`.                        |

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

> 📚 Пример — [`examples/setup.md`](examples/setup.md).

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

Snapshot files are stored in `__snapshots__/<ClassName>.unimock.json` — one directory level above the test file when using `importMeta: import.meta`, or under `tests/__snapshots__/` by default.

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

### Migration note

- **v2 JSONL format (`_jsonl: 2`)** — every `_t:'c'` call entry now carries an explicit `refs` field (`null` when the result held no model instance). The reader identifies the version from the header and falls back to the legacy path for files written as v1 (no `refs` key on some entries). Legacy `.fmt` files (non-JSONL, `{version: 1, ...}`) are still readable but are no longer written.
- **1.9.0 data shape change** — `findAll`, `bulkCreate`, `bulkBuild`, `findAndCountAll` rows are now clean `toJSON()` data (no `dataValues`, `_previousDataValues`, `uniqno` keys); top-level `Date` static results are now `t: 'date'` instead of an ISO string produced by `Date.toJSON()`.

If you have committed snapshots generated before these changes, **re-record them** (`UNIMOCK=record`). Replaying old v1 snapshots still works; the reader reconstructs results via the legacy path.

## noop — universal mock stub

A singleton for use as a drop-in dependency for any service — no call will ever throw:

```ts
import { noop } from '@biorate/unimock';

noop.database.query('SELECT 1'); // → noop
noop.config.get('key').nested; // → noop
'query' in noop.database; // true
await noop.asyncMethod(); // → noop
for (const x of noop.items) {
} // empty iterator
JSON.stringify(noop); // {}
typeof noop.callback; // 'function'
```

> 📚 Пример — [`examples/noop.md`](examples/noop.md).

**Note:** `typeof noop` returns `'function'` (the Proxy target is a function). This is a JavaScript limitation — `typeof` is not interceptable by Proxy.

## Known limitations

1. **`@init()` from `@biorate/lifecycled`** still runs in replay mode because the decorator stores the original descriptor in constructor metadata, not on the instance. Workaround: override `initialize` in the test subclass as a no-op, or check `SnapshotStore.mode` inside `initialize()`.

2. **MockHandler returns synchronously in replay mode.** In record mode, `query()` returns a Promise. In replay mode, it returns the deserialised value directly (await on a non-Promise works, but behaviour is not identical).

3. **Private `#` fields** are not wrapped — `wrapPrototype` and `MockHandler` filter keys starting with `#`.

4. **Nested model objects stay plain in replay.** Reconstruction rebuilds only the top-level shape elements of a static result (single / array / pair / wrapper). Nested include/association objects inside a row remain plain deserialized objects.

5. **Unrecorded instance methods throw in replay.** An instance method that was never invoked on an instance during the record phase throws `UnimockReplayMissError` when called in replay.

6. **Replayed instances are rebuilt by the model's own static `build`.** The model class must be importable and initialized at replay time (for Sequelize models: bound to a `Sequelize` instance — use the [`bindReplaySequelizeModels`](examples/static-methods.md) test-setup helper, which does an offline no-I/O bind in replay mode and is a no-op otherwise). Since 1.10.1, constructor-internal calls during the rebuild pass through to the originals — record/replay construction options no longer need to match and a seeded `build()` call is not required.

### Learn

- Documentation can be found here - [docs](https://biorate.github.io/core/modules/unimock.html).

### Release History

See the [CHANGELOG](https://github.com/biorate/core/blob/master/packages/%40biorate/unimock/CHANGELOG.md)

### License

[MIT](https://github.com/biorate/core/blob/master/packages/%40biorate/unimock/LICENSE)

Copyright (c) 2021-present [Leonid Levkin (llevkin)](mailto:llevkin@yandex.ru)
