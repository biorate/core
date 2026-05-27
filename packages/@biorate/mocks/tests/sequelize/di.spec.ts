import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { container, Types, injectable, inject } from '@biorate/inversion';
import { ISequelizeConnector } from '@biorate/sequelize';
import {
  createMockSequelize,
  setupMockSequelize,
  useMockSequelize,
} from '../../src/sequelize/factories';
import type { MockSequelizeConnection } from '../../src/sequelize/mock-sequelize-connection';
import type { MockModel } from '../../src/sequelize/mock-model';
import type { MockSequelizeConnector } from '../../src/sequelize/mock-sequelize-connector';

describe('createMockSequelize', () => {
  beforeEach(() => {
    container.snapshot();
  });

  afterEach(() => {
    container.restore();
  });

  it('should create connector', () => {
    const connector = createMockSequelize();
    expect(connector).toBeDefined();
  });

  it('should register in container', () => {
    createMockSequelize();

    const injected = container.get<ISequelizeConnector>(Types.Sequelize);
    expect(injected).toBeDefined();
  });

  it('should use custom name', () => {
    const connector = createMockSequelize({ name: 'custom' });
    const connection = connector.getMockConnection('custom');
    expect(connection).toBeDefined();
  });

  it('should apply sync setup', () => {
    const connector = createMockSequelize({
      setup: (conn) => {
        conn.getMockConnection().setQueryResponse([{ id: 1 }]);
      },
    });

    const connection = connector.getMockConnection();
    expect(connection).toBeDefined();
  });

  it('should throw on async setup', () => {
    expect(() =>
      createMockSequelize({
        setup: async (conn) => {
          conn.getMockConnection().setQueryResponse([{ id: 1 }]);
        },
      })
    ).toThrow('Async setup not supported in createMockSequelize');
  });

  it('should not auto-register when disabled', () => {
    createMockSequelize({ autoRegister: false });

    expect(container.isBound(Types.Sequelize)).toBe(false);
  });

  it('should use custom bind type', () => {
    const customType = Symbol('CustomSequelize');
    createMockSequelize({ bindType: customType });

    expect(container.isBound(customType)).toBe(true);
    expect(container.isBound(Types.Sequelize)).toBe(false);
  });
});

describe('setupMockSequelize', () => {
  beforeEach(() => {
    container.snapshot();
  });

  afterEach(() => {
    container.restore();
  });

  it('should apply async setup', async () => {
    await setupMockSequelize(async (connector) => {
      const connection = connector.getMockConnection();
      const mockModel: MockModel = connection.define('User');
      mockModel.setFindAllResponse([{ id: 1, name: 'Alice' }]);
    });

    const connector = container.get<ISequelizeConnector>(Types.Sequelize);
    const connection = connector.get();
    expect(connection).toBeDefined();
  });

  it('should register in container', async () => {
    await setupMockSequelize(async (connector) => {
      connector.getMockConnection().setQueryResponse([{ id: 1 }]);
    });

    const injected = container.get<ISequelizeConnector>(Types.Sequelize);
    expect(injected).toBeDefined();
  });

  it('should not auto-register when disabled', async () => {
    await setupMockSequelize(
      async (connector) => {
        connector.getMockConnection().setQueryResponse([{ id: 1 }]);
      },
      { autoRegister: false }
    );

    expect(container.isBound(Types.Sequelize)).toBe(false);
  });
});

describe('useMockSequelize', () => {
  beforeEach(() => {
    container.snapshot();
  });

  afterEach(() => {
    container.restore();
  });

  it('should create and setup connector', () => {
    const connector = useMockSequelize((conn) => {
      conn.getMockConnection().setQueryResponse([{ id: 1 }]);
    });

    expect(connector).toBeDefined();
  });

  it('should register in container', () => {
    useMockSequelize();

    expect(container.isBound(Types.Sequelize)).toBe(true);
  });
});

describe('DI integration example', () => {
  @injectable()
  class MyService {
    private connector: MockSequelizeConnector;

    constructor() {
      this.connector = container.get<MockSequelizeConnector>(Types.Sequelize);
    }

    async getUsers() {
      const connection = this.connector.getMockConnection();
      const mockModel: MockModel = connection.define('User', {});
      mockModel.setFindAllResponse([{ id: 1, name: 'Alice' }]);
      return mockModel.findAll();
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

    await setupMockSequelize(async (connector) => {
      connector.getMockConnection().setQueryResponse([{ id: 1 }]);
    });

    const service = container.get(MyService);
    const result = await service.getUsers();

    expect(result).toEqual([{ id: 1, name: 'Alice' }]);
  });
});
