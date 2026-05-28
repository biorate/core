# @biorate/unimock

Snapshot-based proxy mocking for connectors and services.

## Usage

```ts
import { Mockable } from '@biorate/unimock';
import { ClickhouseConnector as BaseClickhouseConnector } from '@biorate/clickhouse';

@Mockable()
class ClickhouseConnector extends BaseClickhouseConnector {}
```

Snapshots default to `tests/__snapshots__/<ClassName>.unimock.json` under `process.cwd()` (package root when you run `pnpm test`).

Initialize the DI root **after** setting env (see clickhouse `tests/__mocks__/index.ts` → `getTestRoot()`).

## Environment

| `UNIMOCK` | Proxy | Behaviour |
| --------- | ----- | --------- |
| *(unset)* / `off` / `0` / `false` | off | `@Mockable` is a no-op — real class, no snapshots |
| `record` / `update` | on | Call real implementation and persist snapshots on flush |
| `replay` | on | Return recorded responses; miss → `UnimockReplayMissError` |
| `auto` / `1` / `true` | on | Replay when snapshot file has calls; otherwise record |

| Variable | Description |
| -------- | ----------- |
| `UNIMOCK_SNAPSHOT_DIR` | Override snapshot directory (default: `tests/__snapshots__`) |

Deprecated (shim + one-time warning): `UNIMOCK_UPDATE=1` → `record`, `UNIMOCK_LIVE=1` → `off`.

Call `Unimock.flush()` after tests to persist recorded snapshots (or use `@biorate/unimock/vitest/setup`).

## Scripts

```bash
# CI — replay committed snapshots, no live infrastructure
UNIMOCK=replay pnpm --filter @biorate/clickhouse test

# Re-record snapshots (needs live ClickHouse)
UNIMOCK=record pnpm --filter @biorate/clickhouse test

# E2E / integration without mocks
pnpm --filter @biorate/clickhouse test:integration
```

## Vitest

```ts
// vitest.config.ts
export default defineConfig({
  test: {
    setupFiles: ['@biorate/unimock/vitest/setup'],
  },
});
```

Commit `tests/__snapshots__/*.unimock.json`. CI runs with `UNIMOCK=replay` without infrastructure.
