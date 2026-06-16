# @biorate/unimock

Snapshot-based proxy mocking for connectors and services.

### Examples:

#### Basic service mocking:

```ts
import { Mockable, SnapshotStore, flushAllSnapshots } from '@biorate/unimock';

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

#### Connector mocking (Clickhouse):

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
// (re-bind container and re-create root — see tests/clickhouse.spec.ts)
const { data: data2 } = await root.connector
  .get()
  .query({ query: 'SELECT 1 AS result;', format: 'JSON' });
console.log(data2); // [{ result: 1 }] — from snapshot
```

### Environment

| `UNIMOCK` | Proxy | Behaviour |
| --------- | ----- | --------- |
| *(unset)* / `off` / `0` / `false` | off | `@Mockable` is a no-op — real class, no snapshots |
| `record` / `update` | on | Call real implementation and persist snapshots on flush |
| `replay` | on | Return recorded responses; miss → `UnimockReplayMissError` |
| `auto` / `1` / `true` | on | Replay when snapshot file has calls; otherwise record |

| Variable | Description |
| -------- | ----------- |
| `UNIMOCK_SNAPSHOT_DIR` | Override snapshot directory (default: `tests/__snapshots__`) |

### Vitest setup

```ts
// vitest.config.ts
export default defineConfig({
  test: {
    setupFiles: ['@biorate/unimock/vitest/setup'],
  },
});
```

The setup hooks `afterAll` to flush all stores automatically.

### Scripts

```bash
# CI — replay committed snapshots, no live infrastructure
UNIMOCK=replay pnpm --filter @biorate/clickhouse test

# Re-record snapshots (needs live ClickHouse)
UNIMOCK=record pnpm --filter @biorate/clickhouse test
```

### Learn

- Documentation can be found here - [docs](https://biorate.github.io/core/modules/unimock.html).

### Release History

See the [CHANGELOG](https://github.com/biorate/core/blob/master/packages/%40biorate/unimock/CHANGELOG.md).

### License

[MIT](https://github.com/biorate/core/blob/master/packages/%40biorate/unimock/LICENSE)

Copyright (c) 2024-present [Leonid Levkin (llevkin)](mailto:llevkin@yandex.ru)
