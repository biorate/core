import { ISerializer } from './interfaces';

export const OPAQUE_HANDLE_PACK = 'opaque.handle';

/**
 * @description Values that must not be JSON-cloned (SDK clients, cursors, streams).
 * Replay uses call-chain stubs; this only applies when a value is persisted directly.
 */
export const opaqueHandleSerializer: ISerializer = {
  test(value: unknown): boolean {
    if (!value || typeof value !== 'object') return false;
    const packed = value as { __unimockPack?: string };
    if (packed.__unimockPack === OPAQUE_HANDLE_PACK) return true;
    if (typeof (value as { then?: unknown }).then === 'function') return false;
    const ownKeys = Reflect.ownKeys(value).filter((k) => k !== 'constructor');
    if (!ownKeys.length) return true;
    const record = value as Record<string, unknown>;
    if (typeof record.json === 'function' || typeof record.stream === 'function') {
      return true;
    }
    if (typeof record.query === 'function') return true;
    return false;
  },
  pack() {
    return { __unimockPack: OPAQUE_HANDLE_PACK };
  },
  unpack() {
    return Object.create(null);
  },
};

/** @description Applied before custom {@link MockableOptions.serializers}. */
export const defaultSerializers: ISerializer[] = [opaqueHandleSerializer];
