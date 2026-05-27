import { describe, it, expect, beforeEach } from 'vitest';
import { MockSequelizeConnector } from '../../src/sequelize/mock-sequelize-connector';

describe('MockSequelizeConnector', () => {
  let connector: MockSequelizeConnector;

  beforeEach(() => {
    connector = new MockSequelizeConnector();
  });

  it('should create connection', () => {
    const connection = connector.getMockConnection();
    expect(connection).toBeDefined();
  });

  it('should set query response', async () => {
    const connection = connector.getMockConnection();
    connection.setQueryResponse([{ id: 1, name: 'test' }]);

    const [data] = await connection.query('SELECT * FROM table');
    expect(data).toEqual([{ id: 1, name: 'test' }]);
  });

  it('should define mock model', () => {
    const connection = connector.getMockConnection();
    const mockModel = connection.define('User');

    expect(mockModel).toBeDefined();
  });

  it('should get mock model', () => {
    const connection = connector.getMockConnection();
    connection.define('User');

    const model = connection.getMockModel('User');
    expect(model).toBeDefined();
  });

  it('should track query calls', async () => {
    const connection = connector.getMockConnection();
    connection.setQueryResponse([{ id: 1 }]);
    await connection.query('SELECT 1');

    expect(connection.wasCalled('query')).toBe(true);
    expect(connection.getCallCount('query')).toBe(1);
  });

  it('should track define calls', () => {
    const connection = connector.getMockConnection();
    connection.define('User', { id: 'int' });

    const calls = connection.getAllCalls('define');
    expect(calls[0].args).toEqual(['User', { id: 'int' }]);
  });

  it('should support transaction', async () => {
    const connection = connector.getMockConnection();
    let transactionCalled = false;

    await connection.transaction(async (t) => {
      transactionCalled = true;
      return 'result';
    });

    expect(transactionCalled).toBe(true);
  });

  it('should support sync', async () => {
    const connection = connector.getMockConnection();
    await connection.sync();

    expect(connection.wasCalled('sync')).toBe(true);
  });

  it('should support authenticate', async () => {
    const connection = connector.getMockConnection();
    await connection.authenticate();

    expect(connection.wasCalled('authenticate')).toBe(true);
  });

  it('should apply delay', async () => {
    const connection = connector.getMockConnection();
    connection.withDelay(100);

    const start = Date.now();
    await connection.authenticate();
    const elapsed = Date.now() - start;

    expect(elapsed).toBeGreaterThanOrEqual(95);
  });

  it('should reset mocks', () => {
    const connection = connector.getMockConnection();
    connection.setQueryResponse([{ id: 1 }]);
    connection.define('User');
    connection.reset();

    expect(connection.getCallCount('query')).toBe(0);
    expect(connection.getMockModel('User')).toBeUndefined();
  });

  it('should support conditional query response', async () => {
    const connection = connector.getMockConnection();
    connection
      .whenQuery((sql) => sql.includes('users'))
      .thenReturn([[{ id: 1, name: 'Alice' }], {}]);
    connection
      .whenQuery((sql) => sql.includes('orders'))
      .thenReturn([[{ id: 2, product: 'Item' }], {}]);

    const [usersData] = await connection.query('SELECT * FROM users');
    const [ordersData] = await connection.query('SELECT * FROM orders');

    expect(usersData).toEqual([{ id: 1, name: 'Alice' }]);
    expect(ordersData).toEqual([{ id: 2, product: 'Item' }]);
  });

  it('should throw query error', async () => {
    const connection = connector.getMockConnection();
    connection.setQueryError(new Error('Database error'));

    await expect(connection.query('SELECT 1')).rejects.toThrow('Database error');
  });
});
