import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { container, Types, injectable, inject } from '@biorate/inversion';
import { IClickhouseConnector } from '@biorate/clickhouse';
import {
  createMockClickhouse,
  setupMockClickhouse,
  useMockClickhouse,
} from '../../src/clickhouse/factories';

describe('createMockClickhouse', () => {
  beforeEach(() => {
    container.snapshot();
  });

  afterEach(() => {
    container.restore();
  });

  it('should create connector', () => {
    const connector = createMockClickhouse();
    expect(connector).toBeDefined();
  });

  it('should register in container', () => {
    createMockClickhouse();

    const injected = container.get<IClickhouseConnector>(Types.Clickhouse);
    expect(injected).toBeDefined();
  });

  it('should use custom name', () => {
    const connector = createMockClickhouse({ name: 'custom' });
    const connection = connector.getMockConnection('custom');
    expect(connection).toBeDefined();
  });

  it('should apply sync setup', () => {
    const connector = createMockClickhouse({
      setup: (conn) => {
        conn.getMockConnection().setQueryResponse([{ id: 1 }]);
      },
    });

    const connection = connector.getMockConnection();
    expect(connection.wasCalled('query')).toBe(false);
  });

  it('should throw on async setup', () => {
    expect(() =>
      createMockClickhouse({
        setup: async (conn) => {
          conn.getMockConnection().setQueryResponse([{ id: 1 }]);
        },
      })
    ).toThrow('Async setup not supported in createMockClickhouse');
  });

  it('should not auto-register when disabled', () => {
    createMockClickhouse({ autoRegister: false });

    expect(container.isBound(Types.Clickhouse)).toBe(false);
  });

  it('should use custom bind type', () => {
    const customType = Symbol('CustomClickhouse');
    createMockClickhouse({ bindType: customType });

    expect(container.isBound(customType)).toBe(true);
    expect(container.isBound(Types.Clickhouse)).toBe(false);
  });
});

describe('setupMockClickhouse', () => {
  beforeEach(() => {
    container.snapshot();
  });

  afterEach(() => {
    container.restore();
  });

  it('should apply async setup', async () => {
    await setupMockClickhouse(async (connector) => {
      const connection = connector.getMockConnection();
      connection.setQueryResponse([{ id: 1 }]);
    });

    const connector = container.get<IClickhouseConnector>(Types.Clickhouse);
    const connection = connector.get();
    expect(connection).toBeDefined();
  });

  it('should register in container', async () => {
    await setupMockClickhouse(async (connector) => {
      connector.getMockConnection().setQueryResponse([{ id: 1 }]);
    });

    const injected = container.get<IClickhouseConnector>(Types.Clickhouse);
    expect(injected).toBeDefined();
  });

  it('should not auto-register when disabled', async () => {
    await setupMockClickhouse(
      async (connector) => {
        connector.getMockConnection().setQueryResponse([{ id: 1 }]);
      },
      { autoRegister: false }
    );

    expect(container.isBound(Types.Clickhouse)).toBe(false);
  });
});

describe('useMockClickhouse', () => {
  beforeEach(() => {
    container.snapshot();
  });

  afterEach(() => {
    container.restore();
  });

  it('should create and setup connector', () => {
    const connector = useMockClickhouse((conn) => {
      conn.getMockConnection().setQueryResponse([{ id: 1 }]);
    });

    expect(connector).toBeDefined();
  });

  it('should register in container', () => {
    useMockClickhouse();

    expect(container.isBound(Types.Clickhouse)).toBe(true);
  });
});

describe('DI integration example', () => {
  @injectable()
  class MyService {
    private connector: IClickhouseConnector;
    
    constructor() {
      this.connector = container.get<IClickhouseConnector>(Types.Clickhouse);
    }

    async getData() {
      const result = await this.connector.get().query({
        query: 'SELECT * FROM users',
      });
      const { data } = await result.json();
      return data;
    }
  }

  beforeEach(() => {
    container.snapshot();
  });

  afterEach(() => {
    container.restore();
  });

  it('should work with service', async () => {
    container.bind(MyService).toSelf().inSingletonScope();

    await setupMockClickhouse((connector) => {
      connector.getMockConnection().setQueryResponse([{ id: 1, name: 'Alice' }]);
    });

    const service = container.get(MyService);
    const result = await service.getData();

    expect(result).toEqual([{ id: 1, name: 'Alice' }]);
  });
});
