# @biorate/unimock

Snapshot-based proxy mocking for connectors and services.

## Usage

```ts
import { Mockable } from '@biorate/unimock';
import { ClickhouseConnector as BaseClickhouseConnector } from '@biorate/clickhouse';

@Mockable()
class ClickhouseConnector extends BaseClickhouseConnector {}
```

Snapshots are stored in `__snapshots__/<ClassName>.unimock.json` (relative to `process.cwd()`).

## Environment

| Variable | Description |
| -------- | ----------- |
| `UNIMOCK=0` | Disable proxy |
| `UNIMOCK_UPDATE=1` | Re-record snapshot |
| `UNIMOCK_LIVE=1` | Always call real implementation |
| `UNIMOCK_SNAPSHOT_DIR` | Override snapshot directory (default: `__snapshots__`) |

Call `Unimock.flush()` after tests to persist snapshots.

## Serializers

Built-in `defaultSerializers` handle opaque SDK handles (clients, cursors with `.json()` / `.query()`).
Override or extend via `@Mockable({ serializers: [...] })`.
