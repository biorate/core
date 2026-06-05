import { Container } from 'inversify';
import { injectable as inversifyInjectable } from '@biorate/inversion';
import { defaultSnapshotManager, SnapshotManager } from './snapshot';
import {
  UnimockWrapper,
  createMockProxy,
  MockableMetadata,
  UnimockMode,
  IMockableConnector,
} from './proxy-handler';

const MOCKABLE_INSTANCES = new WeakMap<object, UnimockWrapper<any>>();
const MOCKABLE_METADATA = new WeakMap<new (...args: any[]) => any, MockableMetadata>();

function storeMockableMetadata(
  target: new (...args: any[]) => any,
  metadata: MockableMetadata,
): void {
  MOCKABLE_METADATA.set(target, metadata);
  Reflect.defineMetadata(Symbol.for('unimock.mockable'), metadata, target);
}

export function Mockable(snapshotName = 'default', snapshotManager?: SnapshotManager) {
  return function <T extends new (...args: any[]) => any>(constructor: T) {
    const className = constructor.name;
    const metadata: MockableMetadata = {
      className,
      snapshotName,
      snapshotManager,
    };

    storeMockableMetadata(constructor, metadata);
    inversifyInjectable()(constructor);

    const originalConstructor = constructor;
    const wrappedConstructor = function (this: IMockableConnector, ...args: any[]) {
      const instance = new originalConstructor(...args);

      const effectiveSnapshotManager = snapshotManager || defaultSnapshotManager;
      const handler = new UnimockWrapper(
        instance,
        className,
        snapshotName,
        effectiveSnapshotManager,
      );

      handler.createWrapper();
      MOCKABLE_INSTANCES.set(instance, handler);

      return instance;
    } as any;

    wrappedConstructor.prototype = originalConstructor.prototype;
    wrappedConstructor.prototype.constructor = wrappedConstructor;

    const initMetadata = Reflect.getOwnMetadata(
      Symbol.for('lifecircle.metadata'),
      originalConstructor,
    );
    if (initMetadata) {
      Reflect.defineMetadata(
        Symbol.for('lifecircle.metadata'),
        initMetadata,
        wrappedConstructor,
      );
    }

    return wrappedConstructor;
  };
}

export class Unimock {
  private static snapshotManager = defaultSnapshotManager;

  public static setSnapshotManager(manager: SnapshotManager): void {
    this.snapshotManager = manager;
  }

  public static getSnapshotManager(): SnapshotManager {
    return this.snapshotManager;
  }

  public static getHandler(instance: object): UnimockWrapper<any> | null {
    return MOCKABLE_INSTANCES.get(instance) || null;
  }

  public static flush(): void {
    this.snapshotManager.flush();
  }

  public static clear(className: string, snapshotName = 'default'): void {
    this.snapshotManager.clear(className, snapshotName);
  }

  public static getMode(instance: object): UnimockMode | null {
    const handler = this.getHandler(instance);
    return handler ? handler.getMode() : null;
  }

  public static isMockable(instance: object): boolean {
    return MOCKABLE_INSTANCES.has(instance);
  }

  public static bindMockable<T extends IMockableConnector>(
    container: Container,
    serviceIdentifier: new (...args: any[]) => T,
    snapshotName?: string,
    snapshotManager?: SnapshotManager,
  ): void {
    const metadata = MOCKABLE_METADATA.get(serviceIdentifier);
    const effectiveSnapshotName = snapshotName || metadata?.snapshotName || 'default';
    const effectiveSnapshotManager =
      snapshotManager || metadata?.snapshotManager || this.snapshotManager;

    container
      .bind(serviceIdentifier)
      .toDynamicValue((context) => {
        const instance = new serviceIdentifier();
        return createMockProxy(
          instance,
          serviceIdentifier.name,
          effectiveSnapshotName,
          effectiveSnapshotManager,
        ) as unknown as T;
      })
      .inSingletonScope();
  }

  public static autoBindMockable<T extends IMockableConnector>(
    container: Container,
    serviceIdentifier: new (...args: any[]) => T,
  ): void {
    const metadata = MOCKABLE_METADATA.get(serviceIdentifier);
    if (!metadata) {
      throw new Error(
        `Class ${serviceIdentifier.name} is not decorated with @Mockable()`,
      );
    }
    this.bindMockable(
      container,
      serviceIdentifier,
      metadata.snapshotName,
      metadata.snapshotManager,
    );
  }
}

export { SnapshotManager, defaultSnapshotManager } from './snapshot';
export { CallChain, ChainRecorder } from './chain-recorder';
export { CallRecord, Snapshot } from './snapshot';
export type { UnimockMode } from './proxy-handler';
export type { MockableMetadata } from './proxy-handler';
