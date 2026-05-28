import type { ISerializer } from '@biorate/unimock';

const PACK = 'clickhouse.ResultSet';

/**
 * @description Detects ClickHouse query result objects (`ResultSet` with `.json()` / `.stream()`).
 * Snapshots store call chains via proxy; this serializer is used when a value is persisted directly.
 */
export const clickhouseResultSetSerializer: ISerializer = {
  test(value: unknown): boolean {
    if (!value || typeof value !== 'object') return false;
    const candidate = value as { __unimockPack?: string; json?: unknown; stream?: unknown };
    if (candidate.__unimockPack === PACK) return true;
    return typeof candidate.json === 'function' && typeof candidate.stream === 'function';
  },
  pack() {
    return { __unimockPack: PACK };
  },
  unpack() {
    return Object.create(null);
  },
};

/** @description Serializers to pass into `@Mockable({ serializers: clickhouseSerializers })`. */
export const clickhouseSerializers: ISerializer[] = [clickhouseResultSetSerializer];

export { PACK as CLICKHOUSE_RESULT_SET_PACK };
