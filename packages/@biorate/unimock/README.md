# @biorate/unimock

Snapshot-based proxy mocking for connectors and services. Designed for easy integration and e2e testing.

## Features

- **Zero-config mocking**: Just add `@Mockable()` decorator to your class
- **Snapshot-based**: Automatically records method calls and results
- **Two modes**: `record` (real execution + snapshot) and `replay` (use snapshots)
- **Chain recording**: Captures async call chains for complex scenarios
- **Minimal interface**: No need to manually mock each method

## Installation

```bash
pnpm add -D @biorate/unimock
```

## Usage

### Basic Example

```typescript
import { Mockable, Unimock } from '@biorate/unimock';

@Mockable('my-snapshot')
class MyService {
  async fetchData(id: string): Promise<any> {
    // Real implementation
  }
}

// In test setup:
process.env.UNIMOCK = 'record'; // or 'replay'
const service = new MyService();
```

### With Dependency Injection

```typescript
import { Mockable, Unimock } from '@biorate/unimock';
import { container } from '@biorate/inversion';
import { ClickhouseConnector } from '@biorate/clickhouse';

@Mockable('clickhouse-e2e')
class MockableClickhouseConnector extends ClickhouseConnector {}

// Bind with Unimock
Unimock.autoBindMockable(container, MockableClickhouseConnector);

// Or manual binding
container.bind(MockableClickhouseConnector).toDynamicValue(() => {
  const instance = new MockableClickhouseConnector();
  return Unimock.createMockProxy(
    instance,
    'ClickhouseConnector',
    'clickhouse-e2e'
  );
}).inSingletonScope();
```

### Test Workflow

1. **Record mode** (`UNIMOCK=record`): Run e2e tests with real infrastructure
   - All method calls are recorded to snapshots
   - Snapshots saved to `__snapshots__/<ClassName>/<snapshotName>.json`

2. **Replay mode** (`UNIMOCK=replay`): Run component tests without infrastructure
   - Uses recorded snapshots
   - No real calls to databases/queues
   - Fast and isolated tests

3. **Off mode** (default or `UNIMOCK=off`): No mocking

### Example Test

```typescript
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { Mockable, Unimock } from '@biorate/unimock';
import { getTestRoot } from './__mocks__';

@Mockable('rdkafka')
class RDKafkaConsumerConnectorMock extends RDKafkaConsumerConnector {}

describe('Kafka Consumer', () => {
  beforeAll(async () => {
    process.env.UNIMOCK = 'record'; // First run: record
    // process.env.UNIMOCK = 'replay'; // Subsequent runs: replay
    const root = getTestRoot();
    await root.$run();
  });

  afterAll(() => {
    Unimock.flush(); // Save snapshots
  });

  it('should consume message', async () => {
    // Test code - same for both modes
  });
});
```

## API

### `@Mockable(snapshotName?, snapshotManager?)`

Class decorator that enables mocking.

- `snapshotName`: Name for snapshot file (default: 'default')
- `snapshotManager`: Custom snapshot manager (optional)

### `Unimock`

Static class for managing mocks.

#### Methods

- `flush()`: Save all snapshots to disk
- `clear(className, snapshotName)`: Clear specific snapshot
- `isMockable(instance)`: Check if instance is mockable
- `getMode(instance)`: Get current mode ('record' | 'replay' | 'off')
- `getHandler(instance)`: Get internal handler
- `autoBindMockable(container, serviceIdentifier)`: Auto-bind mockable class to DI container
- `bindMockable(container, serviceIdentifier, snapshotName?, snapshotManager?)`: Manual binding

### Environment Variables

- `UNIMOCK=record`: Record mode (real execution + snapshot)
- `UNIMOCK=replay`: Replay mode (use snapshots)
- `UNIMOCK=off`: No mocking (default)

## Snapshot Format

Snapshots are stored in `__snapshots__/<ClassName>/<snapshotName>.json`:

```json
{
  "chains": {
    "uuid-chain-id": [
      {
        "method": "query",
        "args": [{"query": "SELECT 1"}],
        "result": {"data": [[1]]},
        "timestamp": 1234567890,
        "chainId": "uuid-chain-id"
      }
    ]
  },
  "createdAt": 1234567890,
  "updatedAt": 1234567890
}
```

## Limitations

- Private fields (`#field`) in base classes may not be accessible
- Works best with classes following `@biorate/connector` pattern
- Async method chains are supported but require proper awaiting

## License

MIT
