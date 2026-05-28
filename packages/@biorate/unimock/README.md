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

| Variable | Description |
| -------- | ----------- |
| `UNIMOCK=0` | Disable proxy |
| `UNIMOCK_UPDATE=1` | Re-record snapshot (overwrite existing file) |
| `UNIMOCK_LIVE=1` | Always call real implementation |
| `UNIMOCK_SNAPSHOT_DIR` | Override snapshot directory (default: `tests/__snapshots__`) |

Call `Unimock.flush()` after tests to persist recorded snapshots.

Replay runs only when the snapshot file exists and `calls` is non-empty.

## Record a new snapshot

```bash
# needs live ClickHouse
UNIMOCK=1 UNIMOCK_UPDATE=1 pnpm --filter @biorate/clickhouse test
```

Commit `tests/__snapshots__/*.unimock.json`. CI runs in replay mode without infrastructure.
