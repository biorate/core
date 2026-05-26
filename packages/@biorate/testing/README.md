# @biorate/testing

Test harness, Docker Compose endpoint presets and in-memory connector mocks.

## Profiles

- `memory` (default) — in-memory connectors inside this package
- `docker` — real connectors against `docker-compose.yml` on localhost

Set `BIORATE_TEST_PROFILE=docker` for integration tests.

## Example

```ts
import { Core, inject } from '@biorate/inversion';
import { PgConnector, IPgConnector } from '@biorate/pg';
import { createTestHarness, setupBiorateTest } from '@biorate/testing';

class Root extends Core() {
  @inject(PgConnector) public connector!: IPgConnector;
}

const harness = createTestHarness({
  root: Root,
  profile: 'memory',
  connectors: ['pg', 'redis'],
});

setupBiorateTest(harness);
```

## Memory subpaths

Direct access to mocks (optional):

- `@biorate/testing/memory/pg` — `MemoryPgConnector`
- `@biorate/testing/memory/redis`
- `@biorate/testing/memory/ioredis`
- `@biorate/testing/memory/kafkajs` — `MemoryKafkaBus`, …
- `@biorate/testing/memory/amqp` — `MemoryAmqpConnector`, `channelReady`
- `@biorate/testing/memory/mssql`
- `@biorate/testing/memory/clickhouse`
- `@biorate/testing/memory/minio`
- `@biorate/testing/memory/vault`
- `@biorate/testing/memory/opensearch`

## Supported connectors

| Kind | Memory mock | Docker (`docker-compose.yml`) |
| ---- | ----------- | ----------------------------- |
| `pg`, `redis`, `ioredis`, `kafka`, `amqp` | yes | yes |
| `mssql`, `clickhouse`, `minio`, `vault`, `opensearch` | yes | yes |
| `sequelize` | sqlite via config | sqlite file |
| `mongodb`, `rdkafka` | docker only | yes |

Integration bootstrap: `getProfileConfig(['pg'], 'docker')` and `dockerEndpoints`.
