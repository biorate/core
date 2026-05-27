# Mocks

Universal mocking utilities for @biorate connectors with Vitest integration and DI support.

### Features:

- Generic base classes for all connectors
- Vitest spies integration for call tracking
- Fluent API for response configuration
- Async iterable support for cursors/streams
- DI container integration
- Type-safe mocks

### Installation:

```bash
pnpm add -D @biorate/mocks
```

### Quick Start:

```typescript
import { describe, beforeEach, afterEach, it, expect } from 'vitest';
import { container } from '@biorate/inversion';
import { setupMockClickhouse } from '@biorate/mocks/clickhouse';

describe('MyService', () => {
  beforeEach(() => container.snapshot());
  afterEach(() => container.restore());

  it('should work', async () => {
    await setupMockClickhouse((connector) => {
      connector.getMockConnection().setQueryResponse([{ id: 1, name: 'test' }]);
    });

    container.bind(MyService).toSelf();
    const service = container.get(MyService);

    const result = await service.getData();
    expect(result).toEqual([{ id: 1, name: 'test' }]);
  });
});
```

### API Reference:

#### ClickHouse

##### `createMockClickhouse(options?)`

Create and register MockClickhouseConnector in DI container.

```typescript
const connector = createMockClickhouse({
  setup: (connector) => {
    connector.getMockConnection().setQueryResponse([{ id: 1 }]);
  },
});
```

##### `setupMockClickhouse(setupFn, options?)`

Async version for complex setup.

```typescript
await setupMockClickhouse(async (connector) => {
  const connection = connector.getMockConnection();
  connection.setQueryResponse([{ id: 1 }]);
});
```

##### `MockClickhouseConnection`

- `setQueryResponse(data, options?)` - Set default query response
- `setQueryError(error)` - Set query error
- `setQuerySequence(responses)` - Set sequential responses
- `whenQuery(predicate)` - Conditional query response
- `setInsertResponse(result)` - Set insert response
- `setInsertError(error)` - Set insert error
- `getCallTracker()` - Get call tracker
- `wasCalled(method, args?)` - Check if method was called
- `getCallCount(method)` - Get call count
- `getLastCall(method)` - Get last call
- `clearCalls()` - Clear call history
- `reset()` - Reset all configurations

##### `MockQueryResult`

- `async json()` - Get data as JSON
- `async text()` - Get data as text
- `async *[Symbol.asyncIterator]()` - Async iteration

#### Sequelize

##### `createMockSequelize(options?)`

Create and register MockSequelizeConnector in DI container.

```typescript
const connector = createMockSequelize({
  setup: (connector) => {
    connector.getMockConnection().setQueryResponse([{ id: 1 }]);
  },
});
```

##### `setupMockSequelize(setupFn, options?)`

Async version for complex setup.

```typescript
await setupMockSequelize(async (connector) => {
  const connection = connector.getMockConnection();
  const mockModel = connection.define('User');
  mockModel.setFindAllResponse([{ id: 1, name: 'Alice' }]);
});
```

##### `MockSequelizeConnection`

- `setQueryResponse(data, metadata?)` - Set query response
- `setQueryError(error)` - Set query error
- `whenQuery(predicate)` - Conditional query response
- `define(modelName, attributes?)` - Define mock model
- `getMockModel(modelName)` - Get mock model
- `getAllMockModels()` - Get all mock models
- `wasCalled(method)` - Check if method was called
- `getCallCount(method)` - Get call count
- `reset()` - Reset all configurations

##### `MockModel`

- `setFindAllResponse(data)` - Set findAll response
- `setFindOneResponse(data)` - Set findOne response
- `setCreateResponse(data)` - Set create response
- `setUpdateResponse(count, instances?)` - Set update response
- `setDestroyResponse(count)` - Set destroy response
- `setFindAllError(error)` - Set findAll error
- `setFindOneError(error)` - Set findOne error
- `setCreateError(error)` - Set create error
- `whenFindAll(predicate)` - Conditional findAll
- `whenFindOne(predicate)` - Conditional findOne
- `whenCreate(predicate)` - Conditional create
- `findAll(options?)` - Simulate findAll
- `findOne(options?)` - Simulate findOne
- `create(values, options?)` - Simulate create

### Advanced Usage:

#### Conditional Responses

```typescript
const connection = connector.getMockConnection();

connection
  .whenQuery((q) => q.includes('users'))
  .thenReturn([{ id: 1, name: 'Alice' }])
  .whenQuery((q) => q.includes('orders'))
  .thenReturn([{ id: 2, product: 'Item' }]);

const users = await connection.query({ query: 'SELECT * FROM users' });
const orders = await connection.query({ query: 'SELECT * FROM orders' });
```

#### Sequential Responses

```typescript
connection.setQuerySequence([
  [{ id: 1 }],  // first call
  [{ id: 2 }],  // second call
  [{ id: 3 }],  // third call
]);

const result1 = await connection.query({ query: 'SELECT 1' });
const result2 = await connection.query({ query: 'SELECT 1' });
const result3 = await connection.query({ query: 'SELECT 1' });
```

#### Call Assertions

```typescript
const connection = connector.getMockConnection();
await connection.query({ query: 'SELECT * FROM table' });

expect(connection.wasCalled('query')).toBe(true);
expect(connection.getCallCount('query')).toBe(1);
expect(connection.getLastCall('query')?.args[0].query).toBe('SELECT * FROM table');

// Or use Vitest spies
expect(connection.expectMethod('query')).toHaveBeenCalledWith('query', {
  query: 'SELECT * FROM table',
});
```

#### Async Iteration

```typescript
const connection = connector.getMockConnection();
const result = connection.setQueryResponse([
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' },
  { id: 3, name: 'Charlie' },
]);

// Async iteration
for await (const row of result) {
  console.log(row);
}

// Or get all at once
const { data } = await result.json();
```

#### Delay Simulation

```typescript
const connection = connector.getMockConnection();
connection.withDelay(100); // 100ms delay

connection.setQueryResponse([{ id: 1 }]);
await connection.query({ query: 'SELECT 1' }); // Will take ~100ms
```

#### Error Simulation

```typescript
const connection = connector.getMockConnection();
connection.setQueryError(new Error('Database connection failed'));

await expect(connection.query({ query: 'SELECT 1' })).rejects.toThrow(
  'Database connection failed'
);
```

#### Multiple Connections

```typescript
const connector = new MockClickhouseConnector();

// First connection
connector.getMockConnection('db1').setQueryResponse([{ id: 1 }]);

// Second connection
connector.getMockConnection('db2').setQueryResponse([{ id: 2 }]);

const data1 = await connector.get('db1').query({ query: 'SELECT 1' });
const data2 = await connector.get('db2').query({ query: 'SELECT 1' });
```

### Learn

- Documentation can be found here - [docs](https://biorate.github.io/core/modules/mocks.html).

### License

[MIT](LICENSE)

Copyright (c) 2021-present Leonid Levkin (llevkin)
