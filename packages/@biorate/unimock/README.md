# @biorate/unimock

Snapshot-based proxy mocking for connectors and services.

## Usage

```ts
import { Mockable, Unimock } from '@biorate/unimock';
import { ClickhouseConnector as BaseClickhouseConnector } from '@biorate/clickhouse';

@Mockable()
class ClickhouseConnector extends BaseClickhouseConnector {}

// e2e: record (no snapshot file) → writes __snapshots__/ClickhouseConnector.unimock.json
// component: replay (snapshot exists) → no real infrastructure
```

## Environment

| Variable | Description |
| -------- | ----------- |
| `UNIMOCK=0` | Disable proxy |
| `UNIMOCK_UPDATE=1` | Re-record snapshot |
| `UNIMOCK_LIVE=1` | Always call real implementation |
| `UNIMOCK_SNAPSHOT_DIR` | Directory for `<ClassName>.unimock.json` files |

Call `Unimock.flush()` after tests to persist snapshots.
