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
flushAllSnapshots(); // writes tests/__snapshots__/MockedService.unimock.snap (next to test file)

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

| Export                | Methods                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| --------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `SEQUELIZE_STATICS` | `sync`, `drop`, `create`, `findOne`, `findAll`, `findByPk`, `findOrCreate`, `findOrBuild`, `findCreateFind`, `findAndCountAll`, `destroy`, `update`, `upsert`, `bulkCreate`, `truncate`, `restore`, `count`, `sum`, `min`, `max`, `increment`, `decrement`, `describe`, `scope`, `unscoped`, `schema`, `getTableName`, `addScope`, `removeAttribute`, `getAttributes`, `hasAlias`, `hasMany`, `belongsToMany`, `hasOne`, `belongsTo`, `build`, `bulkBuild`, `warnOnInvalidOptions` |

> 📚 Пример (включая offline-биндинг моделей в replay — обход `ModelNotInitializedError`) — [`examples/static-methods.md`](examples/static-methods.md).

#### Replay reconstruction of model instances

In replay mode, the recorded result of a static that returns model instances is reconstructed into real model instances (with working `toJSON()`, `get()`, `save()`, etc.) by the model's own **original** static `build(plain, { isNewRecord: false })`, captured before wrapping. The result shape determines how the recorded data is rebuilt:

**Constructor-internal pass-through (1.10.1).** While the original `build` is running, the vanilla constructor may re-enter the model's own wrapped prototype methods (e.g. Sequelize `_initValues`). Those inner calls are **not** looked up in the snapshot store — they pass through to the original implementations, and instance state is populated by the model's own constructor. This means the construction options seen in record mode (hydration: `raw: true, attributes: [...]`) and in replay (reconstruction: `{ isNewRecord: false }`) **do not need to match**, and seeding a `build()` call with identical args is no longer required. Post-construction calls (`toJSON()`, `get()`, …) are served from the recorded per-instance `call:{refId}:` entries.

| Statics                                                           | Replayed result                                                               |
| ----------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| `create`, `findOne`, `findByPk`, `build`                  | a single model instance                                                       |
| `findAll`, `bulkCreate`, `bulkBuild`                        | an array of model instances                                                   |
| `findOrCreate`, `findOrBuild`, `findCreateFind`, `upsert` | an `[instance, created]` pair                                               |
| `update`                                                        | a `[count, instances]` pair                                                 |
| `findAndCountAll`                                               | `{ count, rows: instances }`                                                |
| `scope`, `unscoped`, `schema`                               | the model class itself, so chaining like `Model.scope('x').findAll()` works |

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

## Determinism and call keys

Replay lookups are keyed, not compared: every call is mapped to a key
`[prefix]method:stableHash(args)` (MD5, 8 hex chars; args are normalized first), and replay
consumes the recorded entries for that key. Therefore **the same logical call must produce the
same key in record and replay runs**. The normalizer in `makeCallKey` already removes common
sources of nondeterminism:

| Noise in args                                                                                    | Normalized to                        |
| ------------------------------------------------------------------------------------------------ | ------------------------------------ |
| `Date` instances                                                                               | `'__DATE__'` (constant marker)     |
| function arguments                                                                               | `'<callback>'` constant marker     |
| ref-registered objects                                                                           | `'@{refId}'` (assigned by unimock) |
| keys:`transaction`, `session_id`, `uuid`, `transaction_id`, `last_stamp`, `creation` | **dropped from the hash**      |

Everything else in the arguments **is part of the hash**. Typical record/replay killers and how
to fix them in tests:

- **Random/generated values in args** (crypto uuids, tokens, salts) — inject a deterministic
  provider in test mode (e.g. bind a `CryptoProvider` whose outputs are fixed), so a call that
  passed `token: 'abc'` at record time passes the same `token` at replay time.
- **Runtime timestamps inside option objects** that are not plain `Date` instances (e.g.
  `last_stamp: 1698012345678` as a number) — such fields must be listed in
  `HASH_IGNORED_KEYS` (PR to `src/serializer.ts`) or removed from the hashed options.
- **Unstable iteration order** of plain-object args is safe (keys are sorted before hashing),
  but unstable _arrays_ (unordered query results) are not — sort them at the source.

When a key hashes differently at replay, replay misses with `UnimockReplayMissError`. When the
same key is _called more times than recorded_, the extra calls get a `console.warn` and the
**last recorded occurrence** is served (last-wins degradation — see
[FIFO and repeated calls](#fifo-and-repeated-calls)).

## FIFO and repeated calls

Per call key, recorded occurrences form an ordered queue (file order):

- **Replay consumes occurrences FIFO** — the 1st call takes the 1st recorded entry, the 2nd
  call the 2nd, and so on. Repeated same-argument calls with different results
  (incrementing counters, iterators) replay correctly as long as the call _order_ matches.
- **Exhausted queue degrades to last-wins** with a one-time `console.warn` — it does **not**
  throw. A misaligned FIFO therefore can silently feed a wrong recorded result to a later
  call: keep call order deterministic (see
  [Best practices](#best-practices-for-building-tests-with-unimock)).
- **A key that was never recorded** throws `UnimockReplayMissError` (or falls back to the real
  implementation when `UNIMOCK_FALLBACK_ON_MISS=1`).

This FIFO discipline is why large replay suites run with one worker and sequential files — see
[Best practices](#best-practices-for-building-tests-with-unimock).

## Transactions

A `.transaction(...)` call made **through a MockHandler-wrapped connection** (e.g. a Sequelize
connection returned by a mocked `connector.connection('main')`) is recorded as one atomic
entry:

```jsonc
// SequelizeConnector.unimock.snap (real example)
{ "_t": "c",
  "key": "call:ref_Sequelize_1:transaction:ada85d28",   // hash includes the label — see below
  "call": { "args": [],                                  // args stripped by UNIMOCK_SKIP_PROXY_ARGS
            "result": { ... } } }                        // = the recorded callback RESULT
```

Key properties:

- **The callback becomes a constant marker** (`'<callback>'`) in the hash — the callback body
  itself is never serialized.
- **Replay does not execute the callback.** The MockHandler replay path returns the recorded
  callback result directly. Model calls that happened _inside_ the transaction at record time
  are not re-played individually; the transaction is the unit of replay. Side effects the
  callback had on closure variables do not happen in replay either.
- **FIFO hazard:** transactions whose arguments differ only by the callback all share one call
  key → one global FIFO queue for every transaction in the whole run. Any change in
  transaction ordering between record and replay shifts the queue, and later transactions
  silently receive _other transactions'_ recorded results (no error — see
  [FIFO and repeated calls](#fifo-and-repeated-calls)).

**Best practice: give every transaction call site a unique label.** Put a unique marker into
the transaction options so each site hashes to its own key (the label is a real option in the
hash, but can be stripped from the stored args via `UNIMOCK_SKIP_PROXY_ARGS=1`):

```ts
// family-tree pattern (Sequelize): label the flow, keep one key per call site
return this.sequelize.connection('main').transaction(
  { flow: 'person:create' } as never, // as never: the option is unimock-only, not Sequelize API
  async (t) => {
    const row = await PersonModel.create(input, { transaction: t });
    return this.toDomain(row);
  },
);
```

With per-site labels, the FIFO queues become per-site: interleaving between different
transactions no longer matters, and only "same site, same number of calls" is required.
Rules: labels must be **unique across the codebase** and the number of calls per site must
match between record and replay. See [`examples/transactions.md`](examples/transactions.md)
for a full walkthrough.

> 💡 Cleaner alternatives (first-class label support, lint for label uniqueness) are listed in
> [`examples/transactions.md`](examples/transactions.md#cleaner-alternatives-roadmap).

## Environment

### Mode selection

| `UNIMOCK`                                | Behaviour                                                                                                                                                                                                       |
| ------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| _(unset)_ / `off` / `0` / `false`  | Mocking off —**zero-overhead pass-through**: wrapped calls go straight to the original implementation without any argument hashing or call-key computation; nothing is read from or written to snapshots |
| `record` / `update` / `1` / `true` | Record mode — call real implementation, persist snapshots on flush                                                                                                                                             |
| `replay`                                 | Replay mode — return recorded responses; miss →`UnimockReplayMissError`                                                                                                                                     |

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

Snapshot files follow a strict mode contract. It is enforced at three levels: the `@Mockable()` wrappers (they never touch the store outside record mode), the store API itself, and the contract tests (`tests/unit/mode-guards.spec.ts`, `tests/unit/record-session.spec.ts`).

1. **Only record mode writes.** `SnapshotStore.record()` and `store.flush()` are no-ops outside record mode (defense in depth: the wrappers already skip them, and the guards also cover direct API calls). `flushAllSnapshots()` is guarded the same way.
2. **A record session starts from a clean slate.** In record mode the store constructor does not load an existing snapshot file, and the first `flush()` of a session rewrites the file in full (truncate + rewrite). Cross-session duplicate `_t:'c'` lines for the same call key are therefore impossible. The transition into record, for example `setMode('replay')` followed by `setMode('record')`, sweeps every cached store: in-memory calls, pools and pending buffers are reset, so the next flush rewrites the file again. Repeating `setMode('record')` while already in record mode does **not** sweep, the current session stays intact.
3. **Replay and off physically cannot change snapshot files.** Neither mode creates, appends to, or truncates anything. A replay run against committed snapshots leaves them byte-for-byte identical.

**Edge case: an unflushed session leaves the file stale.** Snapshot data lives in memory until `flush()` runs (the vitest setup calls `flushAllSnapshots()` for you in an `afterAll` hook). If a record session ends without a single flush, the old file stays on disk untouched and still holds the previous session's content.

**Parallel safety convention.** One snapshot file belongs to exactly one record session at a time. Keep `className` + snapshot directory unique per spec file, or let each spec record into its own `mkdtempSync` directory. Under this convention concurrent record sessions never write the same file. Concurrent replay runs are safe by construction since replay never writes.

### Config file (`.unimock.json`)

The `.unimock.json` file sets the same options as the environment variables above, committing the test configuration to the repository. The file is looked up as follows:

1. `UNIMOCK_CONFIG_FILE` — an explicit path, resolved against the current working directory.
2. `./.unimock.json` — in the current working directory, by default.

Each option is resolved as **file → env → default**: a value present in the file shadows the corresponding environment variable, and a missing or invalid file leaves the environment variables in charge. A broken file — invalid JSON, a non-object root, or an explicitly configured path that is missing — logs a `console.warn` and is treated as absent; a missing default file is silently ignored. A runtime `SnapshotStore.setMode()` (and `Unimock.mode`) always takes precedence over the file's `mode`.

| Ключ                | Тип                                 | Дефолт            | Соответствующая env-переменная    |
| ----------------------- | -------------------------------------- | ----------------------- | ---------------------------------------------------------- |
| `mode`                | string (`off`/`record`/`replay`) | `off`                 | `UNIMOCK`                                                |
| `snapshotDir`         | string                                 | `tests/__snapshots__` | `UNIMOCK_SNAPSHOT_DIR`                                   |
| `snapshotExt`         | string                                 | `.snap`               | `SNAPSHOT_EXT`                                           |
| `gzip`                | boolean                                | `false`               | `UNIMOCK_GZIP=1`                                         |
| `valuePool`           | boolean                                | `true`                | `UNIMOCK_VALUE_POOL=0`                                   |
| `valuePoolThreshold`  | number                                 | `100000`              | `UNIMOCK_VALUE_POOL_THRESHOLD`                           |
| `valuePoolCountLimit` | number                                 | `2000`                | `UNIMOCK_VALUE_POOL_COUNT_LIMIT`                         |
| `stripRequest`        | boolean                                | `false`               | `UNIMOCK_STRIP_REQUEST=1`                                |
| `skipProxyArgs`       | boolean                                | `false`               | `UNIMOCK_SKIP_CONN_ARGS` / `UNIMOCK_SKIP_PROXY_ARGS=1` |
| `rowPool`             | boolean                                | `false`               | `UNIMOCK_ROW_POOL=1`                                     |
| `compact`             | boolean                                | `false`               | `UNIMOCK_COMPACT=1`                                      |
| `fallbackOnMiss`      | boolean                                | `false`               | `UNIMOCK_FALLBACK_ON_MISS=1`                             |

Example:

```json
{
  "mode": "record",
  "gzip": true,
  "valuePoolThreshold": 50000,
  "snapshotDir": "tests/__snapshots__"
}
```

### Optimisation flags

| Variable                                                        | Description                                                                                                  |
| --------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| `UNIMOCK_GZIP=1`                                              | Gzip-compress snapshot files on write (~97 % reduction). Auto-detected on read.                              |
| `UNIMOCK_STRIP_REQUEST=1`                                     | Strip the `request` field (Axios HTTP internals, ~40 KB per entry).                                        |
| `UNIMOCK_SKIP_PROXY_ARGS=1` (or `UNIMOCK_SKIP_CONN_ARGS=1`) | Skip serialising `args` for `call:*` entries — they are not used in replay.                             |
| `UNIMOCK_SNAPSHOT_DIR`                                        | Custom snapshot directory fallback (default:`tests/__snapshots__`). Ignored when `importMeta` is passed. |
| `SNAPSHOT_EXT`                                                | Snapshot file extension (default:`.snap`). File name: `{ClassName}.unimock{ext}`.                        |

### Always-on optimisations

- **refId caching** — `WeakMap<object, string>` deduplicates `call:ref_X:method:hash` entries when the same connection object is returned by `.get()`.
- **String pool** — strings >500 characters are moved to a shared dictionary (`strings:` key in the JSON file) and transparently expanded back on read.

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

## Best practices for building tests with unimock

Distilled from running unimock against a real application (NestJS + Sequelize + MinIO e2e
suite). Follow these rules to keep record/replay stable:

### 1. Test layout

```
tests/
├── __mocks__/e2e.ts        # mock() calls + @Mockable subclasses + DI rebinds
├── e2e/
│   ├── setup.ts            # beforeAll: bind models, boot app ONCE per process
│   ├── global-setup.ts     # isReplay() → skip migrations/infra preparation
│   └── *.e2e.spec.ts       # specs — only @suite classes, no helpers in bodies
└── e2e/__snapshots__/      # <ClassName>.unimock.snap, committed to the repo
```

### 2. Vitest configuration for large suites

```ts
export default defineConfig({
  test: {
    pool: 'threads',
    maxWorkers: 1, // FIFO is per-process state — never run files in parallel
    fileParallelism: false, // same
    isolate: false, // faster, but see "boot once" below
    setupFiles: ['@biorate/unimock/vitest/setup'], // afterAll → flushAllSnapshots()
  },
});
```

- `maxWorkers: 1` + `fileParallelism: false` are **mandatory** for app-level replay: call order
  across files is part of the FIFO contract.
- With `isolate: false`, boot the application **once per process** and guard it with a flag:

```ts
let booted = false;
beforeAll(async () => {
  // Re-running the app boot resets/breaks unimock's FIFO ref counters.
  if (booted) return;
  booted = true;
  await container.get<Root>(Root).$run();
});
```

- Use a deterministic file order (custom sequencer or alphabetical) so record and replay walk
  the specs in the same order.

### 3. Wiring a real app (DI pattern)

Do not mock the app's internals — mock the boundary connectors and rebind them in the DI
container:

```ts
// tests/__mocks__/e2e.ts
import { Mockable, mock, noop, SEQUELIZE_STATICS } from '@biorate/unimock';

// Sequelize models: mock statics (findAll, create, ...) on each model class
Object.values(Models).forEach((model) => mock(model, { statics: [SEQUELIZE_STATICS] }));

// HTTP out: mock the fetch static
Object.values(Api).forEach((api) => mock(api, { statics: [['fetch']] }));

// Connectors: @Mockable subclass + container rebind (depth: 1 → don't wrap nested results)
@Mockable({ depth: 1 })
class SequelizeConnector extends BaseSequelizeConnector {}
container
  .rebind<ISequelizeConnector>(Types.Sequelize)
  .to(SequelizeConnector)
  .inSingletonScope();
```

### 4. Determinism contract

Same logical call ⇔ same hash (see [Determinism and call keys](#determinism-and-call-keys)):
inject deterministic providers for uuids/crypto/tokens in tests, avoid runtime-generated
values in hashed arguments, and do not rely on `Date.now()` inside option objects (plain `Date`
instances are safe — they normalize to a marker).

### 5. Call-order contract (FIFO)

The order of wrapped calls is part of the snapshot contract: repeated same-key calls replay in
recorded order, an exhausted queue silently degrades to last-wins. Keep specs sequential,
don't boot the app twice per process, and don't reorder specs between record and replay.

### 6. Transactions

Label every transaction call site with a unique option (see
[Transactions](#transactions)) — otherwise all transactions share one global FIFO queue.

### 7. Snapshot hygiene

- **Record rewrites snapshot files.** A record session starts from a clean slate and the first
  flush rewrites the file in full — always re-record the _whole suite_, never hand-edit
  `.unimock.snap` files.
- Snapshot files carry binary gzip diffs between record runs: **never commit accidental
  snapshot changes** — revert with `git checkout -- tests/**/__snapshots__/`.
- Standard workflow when server logic changes:
  1. start the live infra (docker compose),
  2. run migrations,
  3. `UNIMOCK=record` — re-record snapshots,
  4. `UNIMOCK=replay` — verify the committed snapshots.
- CI always runs replay; record requires the live stack and is a local/CI-dedicated step.

### 8. What replays and what really runs

- Wrapped methods, statics and MockHandler-mediated calls (connector/connection methods) are
  served from snapshots.
- **Your application code always really runs** — use `isReplay()` in app/test setup to skip
  infrastructure-dependent preparation (migrations, seeding, network listeners).
- Callbacks passed through MockHandler-mediated calls are **not invoked** in replay (see
  [Transactions](#transactions) and Known limitations).

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

Snapshot files are stored in `__snapshots__/<ClassName>.unimock.snap`. When `importMeta: import.meta` is passed, the `__snapshots__` directory is created **inside** the directory that also contains the test file (`resolve(dirname(testFilePath), '__snapshots__')`); otherwise the default is `tests/__snapshots__/` (or `UNIMOCK_SNAPSHOT_DIR`). The extension is configurable via `snapshotExt`/`SNAPSHOT_EXT` (default `.snap`).

Each file is a **streaming JSONL (v2)** document written line by line. The first line is the header:

```json
{ "_jsonl": 2, "className": "MockedService" }
```

The following lines belong to one of three forms:

- `_t:'s'` — string-pool entry: `{ "_t": "s", "ref": "$0", "val": "<long string>" }`. Strings longer than `POOL_THRESHOLD` (500 characters) are deduplicated here and referenced inline.
- `_t:'v'` — value-pool entry: `{ "_t": "v", "ref": "$0", "val": [ ... ] }` for shared arrays/objects.
- `_t:'c'` — call record: `{ "_t": "c", "key": "query:a1b2c3d4", "call": { "args": [ ... ], "result": { ... }, "error": { ... }?, "refs": null } }`. Every `_t:'c'` line carries a `refs` field (`null` when the result held no model instance).

Values are serialized in the `{ t, v }` tagged format (`'string'`, `'number'`, `'object'`, `'array'`, `'ref'`, …).

When compression is enabled (`UNIMOCK_GZIP=1`), each batch of ~500 lines is written as a separate gzip member (`gzipSync`, level 9); on read, gzip is auto-detected via the `0x1f 0x8b` magic bytes.

The legacy v1 format — a single JSON object `{ version, className, calls }` (including the older `.fmt` files) — is still read, but is no longer written.

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
7. **Replay is fully DB-less when `bindReplaySequelizeModels` is used.** The helper makes the bound `Sequelize` instance hermetic: its connection manager is replaced with an offline stub (`getConnection` returns an inert in-memory connection whose every query resolves to an empty postgres-shaped result). Any code path that executes raw library code on the instance during replay — strays like `Model.sequelize?.query('SELECT setval(...)')`, `authenticate()`, or a direct `transaction()` — terminates offline instead of opening a live connection. The stub is instance-level and idempotent. When `UNIMOCK_FALLBACK_ON_MISS=1` the connection manager is intentionally left live so the replay-miss fallback can run against the real backend.
8. **Callbacks on MockHandler-mediated calls are not invoked in replay.** Prototype-wrapped methods replay recorded callback invocations (see [Callback arguments](#callback-arguments)), but calls routed through a `MockHandler` (connection objects, `.transaction(...)`) do not: replay returns the recorded result directly and never calls the callback. Closure side effects made by such callbacks at record time do not happen at replay; treat MockHandler-mediated callbacks as opaque (e.g. label transaction sites, see [Transactions](#transactions)).

### Learn

- Documentation can be found here - [docs](https://biorate.github.io/core/modules/unimock.html).

## Roadmap — improvement candidates

Curated list of worthwhile improvements, distilled from running unimock against a real
application (large NestJS + Sequelize e2e suite). Each item states why it is worth doing and
its cost/risk. **Do not re-propose the rejected ideas at the bottom** — they were evaluated
and turned down deliberately.

### High value

1. **Replay-friendly lifecycle for `@init()`** — the only blocker that still forces live
   infrastructure during replay runs. The `@biorate/lifecycled` decorator stores the original
   descriptor in constructor metadata, so `initialize()` executes (and connects) before any
   snapshot lookup; every consumer must currently override it manually. Candidate: an exported
   helper (e.g. a `lifecycleGuard()` wrapper or an `@Mockable()`-aware hook) that no-ops
   `initialize()` when `isReplay()` — plus an upstream patch or documented contract with
   `@biorate/lifecycled`. _Win: fully offline replay e2e for every connector suite. Cost: small–medium, one public API addition._
2. **First-class transaction flow labels** — today every transaction call site needs a
   hand-written marker in the options (`{ flow: 'site' } as never`, see
   [Transactions](#transactions)) to avoid one global FIFO queue. Candidate: a supported
   option (e.g. `MockableOptions.transactionFlow`), a dedicated snapshot field, and a lint
   script enforcing label uniqueness across a codebase. _Win: removes type-cast lies from
   production code and makes the per-site FIFO a documented, guarded feature. Cost: medium (API design + snapshot format field)._
3. **Call-key observability (`UNIMOCK_DEBUG`)** — today a misaligned FIFO is almost silent:
   one-time `console.warn` on exhaustion, then last-wins results that look plausible. Candidate:
   an env flag that logs `callKey → hit | miss | degraded` per call (optionally filtered by
   method name), so record/replay divergences are diagnosable in large suites instead of being
   discovered via wrong test data. _Win: makes the FIFO contract debuggable. Cost: small (logging only, no format change)._

### Medium / decision-gated

4. **Promise parity in replay** — `MockHandler` replay returns values synchronously while
   record returns Promises; `await` hides the difference but edge cases (`.then` chains,
   `Promise.all` typing) behave differently. Candidate: optional mode that wraps replay
   results in `Promise.resolve(...)`. _Cost: small, but a behavior change — gate behind a flag or major version; measure overhead first._
5. **Docs/limitations audit: nested association replay** — README limitation #4 ("nested
   include/association objects inside a row remain plain") is **stale**: `rebuildInstance`
   synthesizes include trees and Sequelize `_setInclude` rehydrates nested rows recursively,
   covered by `tests/unit/association-replay.spec.ts`. Action: verify the remaining truth
   scope of that limitation (if any) and update README/AGENTS. _Cost: trivial._

### Rejected (do not re-propose)

- **Auto-detection of new "noisy" hash keys** — no reliable way to distinguish "same logical
  call" heuristically; the determinism contract + docs are the fix.
- **Proxy-on-class wrapping** — breaks on private `#` fields (the original reason for the
  Method Override architecture).
- **Arg validation on replay** — recorded `args` may be stripped (`UNIMOCK_SKIP_PROXY_ARGS`)
  and are not the lookup mechanism; validating them adds cost with no replay benefit.

### Release History

See the [CHANGELOG](https://github.com/biorate/core/blob/master/packages/%40biorate/unimock/CHANGELOG.md)

### License

[MIT](https://github.com/biorate/core/blob/master/packages/%40biorate/unimock/LICENSE)

Copyright (c) 2021-present [Leonid Levkin (llevkin)](mailto:llevkin@yandex.ru)
