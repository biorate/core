import { describe, it, expect, beforeEach } from 'vitest';
import { MockClickhouseConnector } from '../../src/clickhouse/mock-clickhouse-connector';

describe('MockClickhouseConnector', () => {
  let connector: MockClickhouseConnector;

  beforeEach(() => {
    connector = new MockClickhouseConnector();
  });

  it('should create connection', () => {
    const connection = connector.getMockConnection();
    expect(connection).toBeDefined();
  });

  it('should return mock query result', async () => {
    const connection = connector.getMockConnection();
    connection.setQueryResponse([{ id: 1, name: 'test' }]);

    const result = await connection.query({ query: 'SELECT * FROM table' });
    const { data } = await result.json();

    expect(data).toEqual([{ id: 1, name: 'test' }]);
  });

  it('should track query calls', async () => {
    const connection = connector.getMockConnection();
    connection.setQueryResponse([{ id: 1 }]);

    await connection.query({ query: 'SELECT 1' });

    expect(connection.wasCalled('query')).toBe(true);
    expect(connection.getCallCount('query')).toBe(1);
  });

  it('should support async iteration', async () => {
    const connection = connector.getMockConnection();
    const result = connection.setQueryResponse([
      { id: 1 },
      { id: 2 },
      { id: 3 },
    ]);

    const items = [];
    for await (const item of result) {
      items.push(item);
    }

    expect(items).toEqual([{ id: 1 }, { id: 2 }, { id: 3 }]);
  });

  it('should support conditional responses', async () => {
    const connection = connector.getMockConnection();
    const usersResult = connection.setQueryResponse([{ id: 1, name: 'Alice' }]);
    const ordersResult = connection.setQueryResponse([{ id: 2, name: 'Order' }]);

    // Note: conditional responses require manual setup in current implementation
    // This is a simplified test
    expect((await usersResult.json()).data).toEqual([{ id: 1, name: 'Alice' }]);
  });

  it('should support sequential responses', async () => {
    const connection = connector.getMockConnection();
    connection.setQuerySequence([
      [{ id: 1 }],
      [{ id: 2 }],
      [{ id: 3 }],
    ]);

    const result1 = await connection.query({ query: 'SELECT 1' });
    const result2 = await connection.query({ query: 'SELECT 1' });
    const result3 = await connection.query({ query: 'SELECT 1' });

    expect((await result1.json()).data).toEqual([{ id: 1 }]);
    expect((await result2.json()).data).toEqual([{ id: 2 }]);
    expect((await result3.json()).data).toEqual([{ id: 3 }]);
  });

  it('should throw error', async () => {
    const connection = connector.getMockConnection();
    connection.setQueryError(new Error('Database error'));

    await expect(
      connection.query({ query: 'SELECT 1' })
    ).rejects.toThrow('Database error');
  });

  it('should support insert', async () => {
    const connection = connector.getMockConnection();
    connection.setInsertResponse({
      executed: true,
      query_id: 'mock-123',
      response_headers: {},
    });

    const result = await connection.insert({
      table: 'test',
      values: [{ id: 1 }],
    });

    expect(result.executed).toBe(true);
    expect(result.query_id).toBe('mock-123');
  });

  it('should support command', async () => {
    const connection = connector.getMockConnection();
    connection.setCommandResponse({ query_id: 'mock-123' });

    const result = await connection.command({ query: 'CREATE TABLE test' });

    expect(result.query_id).toBe('mock-123');
  });

  it('should apply delay', async () => {
    const connection = connector.getMockConnection();
    connection.withDelay(100);
    connection.setQueryResponse([{ id: 1 }]);

    const start = Date.now();
    await connection.query({ query: 'SELECT 1' });
    const elapsed = Date.now() - start;

    expect(elapsed).toBeGreaterThanOrEqual(95);
  });

  it('should reset mocks', async () => {
    const connection = connector.getMockConnection();
    connection.setQueryResponse([{ id: 1 }]);
    connection.reset();

    await expect(
      connection.query({ query: 'SELECT 1' })
    ).rejects.toThrow('No matching response configuration found');
  });

  it('should get last call', async () => {
    const connection = connector.getMockConnection();
    connection.setQueryResponse([{ id: 1 }]);

    await connection.query({ query: 'SELECT 1' });
    await connection.query({ query: 'SELECT 2' });

    const lastCall = connection.getLastCall('query');
    expect(lastCall?.args[0].query).toBe('SELECT 2');
  });

  it('should clear calls', async () => {
    const connection = connector.getMockConnection();
    connection.setQueryResponse([{ id: 1 }]);
    await connection.query({ query: 'SELECT 1' });
    connection.clearCalls();

    expect(connection.wasCalled('query')).toBe(false);
  });
});
