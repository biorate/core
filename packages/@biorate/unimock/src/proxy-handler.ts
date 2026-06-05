import { CallChain, ChainRecorder } from './chain-recorder';
import { SnapshotManager, defaultSnapshotManager } from './snapshot';
import { UnimockSnapshotNotFoundError } from './errors';

export type UnimockMode = 'record' | 'replay' | 'off';

function isAsyncFunction(fn: (...args: unknown[]) => unknown): boolean {
  return fn.constructor.name === 'AsyncFunction';
}

export interface MockableMetadata {
  className: string;
  snapshotName?: string;
  snapshotManager?: SnapshotManager;
}

export function getMockableMetadata(target: any): MockableMetadata | null {
  return Reflect.getMetadata(Symbol.for('unimock.mockable'), target) || null;
}

export interface IMockableConnector {
  connections?: Map<string, any>;
  current?: any;
  use(name: string): void;
  connection(name?: string): any;
  get(name?: string): any;
  create(config: any): Promise<any>;
  initialize?(): Promise<void>;
  [key: string]: any;
}

export class UnimockWrapper<T extends IMockableConnector> {
  private chainRecorder: ChainRecorder;
  private mode: UnimockMode;
  private wrappedInstance: T;
  private connectionsOverride: Map<string, any> = new Map();
  private currentOverride: any = undefined;

  constructor(
    target: T,
    private className: string,
    snapshotName: string,
    private snapshotManager: SnapshotManager = defaultSnapshotManager,
  ) {
    this.mode = this.resolveMode();
    this.chainRecorder = new ChainRecorder(className, snapshotName, snapshotManager);
    this.wrappedInstance = target;
  }

  private resolveMode(): UnimockMode {
    const envMode = process.env.UNIMOCK;
    if (!envMode) {
      return 'off';
    }
    if (envMode !== 'record' && envMode !== 'replay' && envMode !== 'off') {
      throw new Error(`Invalid UNIMOCK mode: [${envMode}]. Allowed: record, replay, off`);
    }
    return envMode as UnimockMode;
  }

  private async executeAndRecord(
    method: string,
    args: unknown[],
    originalFn: (...args: unknown[]) => unknown,
  ): Promise<unknown> {
    try {
      const result = await originalFn.apply(this.wrappedInstance, args);
      this.chainRecorder.recordCall(method, args, result);
      return result;
    } catch (error) {
      this.chainRecorder.recordCall(method, args, undefined, error as Error);
      throw error;
    }
  }

  private executeAndRecordSync(
    method: string,
    args: unknown[],
    originalFn: (...args: unknown[]) => unknown,
  ): unknown {
    try {
      const result = originalFn.apply(this.wrappedInstance, args);
      this.chainRecorder.recordCall(method, args, result);
      return result;
    } catch (error) {
      this.chainRecorder.recordCall(method, args, undefined, error as Error);
      throw error;
    }
  }

  public createWrapper(): T {
    const wrapped = this.wrappedInstance;
    const mode = this.mode;
    const chainRecorder = this.chainRecorder;
    const className = this.className;
    const self = this;

    if (mode === 'off') {
      return wrapped;
    }

    const originalCreate = wrapped.create?.bind(wrapped);
    const originalConnection = wrapped.connection?.bind(wrapped);
    const originalGet = wrapped.get?.bind(wrapped);
    const originalUse = wrapped.use?.bind(wrapped);

    const mockMethods: any = {
      get connections() {
        if (wrapped.connections) {
          return wrapped.connections;
        }
        return self.connectionsOverride;
      },

      get current() {
        if (wrapped.current !== undefined) {
          return wrapped.current;
        }
        return self.currentOverride;
      },

      use(name: string) {
        if (originalUse) {
          return originalUse(name);
        }
        self.currentOverride = self.connectionsOverride.get(name);
      },

      connection(name?: string) {
        if (originalConnection) {
          return originalConnection(name);
        }
        if (!name) return self.currentOverride;
        return self.connectionsOverride.get(name);
      },

      get(name?: string) {
        if (originalGet) {
          return originalGet(name);
        }
        return this.connection(name);
      },

      async create(config: any) {
        if (originalCreate) {
          return originalCreate(config);
        }
        const conn = { name: config.name };
        self.connectionsOverride.set(config.name, conn);
        return conn;
      },
    };

    const proto = Object.getPrototypeOf(wrapped);
    const methodNames = Object.getOwnPropertyNames(proto).filter(
      (name) =>
        name !== 'constructor' &&
        name !== 'connections' &&
        name !== 'current' &&
        name !== 'use' &&
        name !== 'connection' &&
        name !== 'get' &&
        name !== 'create' &&
        name !== 'initialize' &&
        typeof (wrapped as any)[name] === 'function',
    );

    for (const methodName of methodNames) {
      const originalFn = (wrapped as any)[methodName];
      if (typeof originalFn !== 'function') continue;

      if (mode === 'record') {
        mockMethods[methodName] = function (...args: unknown[]) {
          const boundFn = originalFn.bind(wrapped);
          if (isAsyncFunction(originalFn)) {
            return self.executeAndRecord(methodName, args, boundFn);
          }
          return self.executeAndRecordSync(methodName, args, boundFn);
        };
        continue;
      }

      if (mode === 'replay') {
        mockMethods[methodName] = function (...args: unknown[]) {
          let chainId = chainRecorder.getFirstChainId();
          if (!chainId) {
            throw new UnimockSnapshotNotFoundError(className, chainRecorder.snapshotName);
          }

          let chain = chainRecorder.getChain(chainId);
          if (!chain) {
            chain = chainRecorder.loadChain(chainId);
          }

          if (!chain || !chain.hasRecord(methodName)) {
            throw new UnimockSnapshotNotFoundError(
              className,
              `${chainRecorder.snapshotName}:${methodName}`,
            );
          }

          const result = chain.getResult(methodName);
          if (result instanceof Error) {
            throw result;
          }
          return Promise.resolve(result);
        };
        continue;
      }
    }

    if (mode === 'replay') {
      mockMethods.initialize = async function () {
        // Skip real initialization in replay mode
      };
    }

    for (const [key, value] of Object.entries(mockMethods)) {
      try {
        Object.defineProperty(wrapped, key, {
          value: typeof value === 'function' ? value.bind(wrapped) : value,
          writable: true,
          configurable: true,
          enumerable: false,
        });
      } catch (e) {
        // Ignore errors for non-configurable properties
      }
    }
    return wrapped;
  }

  public flush(): void {
    this.chainRecorder.flush();
  }

  public getMode(): UnimockMode {
    return this.mode;
  }

  public getChainRecorder(): ChainRecorder {
    return this.chainRecorder;
  }
}

export function createMockProxy<T extends IMockableConnector>(
  instance: T,
  className: string,
  snapshotName: string,
  snapshotManager: SnapshotManager = defaultSnapshotManager,
): T {
  const handler = new UnimockWrapper<T>(
    instance,
    className,
    snapshotName,
    snapshotManager,
  );
  return handler.createWrapper();
}
