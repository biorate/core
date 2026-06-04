import { injectable } from '@biorate/inversion';
import { init } from '@biorate/lifecycled';
import { Constructor, MockableOptions } from './interfaces';
import { isUnimockEnabled } from './env';
import { createMockProxy, unwrapMockTarget } from './proxy';
import { getSnapshotStore } from './snapshot-store';

/**
 * @description Class decorator: wraps instances in a recording/replay proxy.
 * One snapshot file per class under `tests/__snapshots__` (see `UNIMOCK_SNAPSHOT_DIR`).
 *
 * @example
 * ```ts
 * @Mockable()
 * class ClickhouseConnector extends BaseClickhouseConnector {}
 * ```
 */
export function Mockable(options?: MockableOptions) {
  return function <T extends Constructor>(Base: T): T {
    const className = Base.name;

    const Mocked = class extends Base {
      constructor(...args: any[]) {
        super(...args);
        if (!isUnimockEnabled()) return;
        const store = getSnapshotStore(className, options);
        return createMockProxy(this, store, options, 'root') as this;
      }

      protected async initialize(): Promise<void> {
        const store = getSnapshotStore(className, options);
        if (store.isReplay) return;
        const baseProto = Reflect.getPrototypeOf(Mocked.prototype) as {
          initialize: (this: unknown) => Promise<void>;
        };
        return baseProto.initialize.call(unwrapMockTarget(this));
      }
    };

    const descriptor = Object.getOwnPropertyDescriptor(Mocked.prototype, 'initialize');
    if (descriptor) init()(Mocked.prototype, 'initialize', descriptor);

    injectable()(Mocked);
    Object.defineProperty(Mocked, 'name', { value: className });
    return Mocked as T;
  };
}
