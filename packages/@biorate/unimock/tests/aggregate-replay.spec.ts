import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { Column, DataType, Model, Sequelize, Table } from '@biorate/sequelize';
import {
  MODE_OFF,
  MODE_REPLAY,
  Mockable,
  SEQUELIZE_STATICS,
  SnapshotStore,
  getSnapshotStore,
  makeCallKey,
  serialize,
  type SnapshotCall,
} from '../src';

/**
 * Regression: static findOne results must replay as REAL Model instances with
 * populated dataValues — including non-attribute keys such as aggregate aliases
 * (`number` from `attributes: [[fn('MAX', col('order_number')), 'number']]`).
 * `rebuildInstance` calls the ORIGINAL `build(plain, { isNewRecord: false, raw: true })`
 * whose `raw` flag makes `set()` keep every row key in `dataValues` — including
 * non-attribute keys. Pre-fix the rebuilt instance had an EMPTY dataValues.
 *
 * Lines are seeded directly into each model's own store (the same cached store the
 * `@Mockable` static wrappers captured), so the tests run fully offline and
 * deterministically in replay mode. Models are bound to an offline Sequelize
 * instance (the constructor performs no I/O). Also guards the raw:true contract:
 * a `refs === null` entry stays plain on replay (never reconstructed into a Model).
 */

const SNAPSHOT_DIR = mkdtempSync(join(tmpdir(), 'unimock-aggregate-replay-'));

const PG = {
  logging: false,
  host: 'localhost',
  port: 5432,
  dialect: 'postgres',
  username: 'postgres',
  password: 'postgres',
  database: 'postgres',
};

@Mockable({ statics: [SEQUELIZE_STATICS], snapshotDir: SNAPSHOT_DIR })
@Table({ tableName: 'aggregate_replay_order_lists', timestamps: false })
class OrderListModel extends Model {
  @Column({ type: DataType.INTEGER, primaryKey: true })
  id: number;

  @Column(DataType.INTEGER)
  shop_id: number;

  @Column(DataType.INTEGER)
  order_type: number;

  @Column(DataType.INTEGER)
  order_number: number;

  @Column(DataType.DATE)
  date: Date;
}

@Mockable({ statics: [SEQUELIZE_STATICS], snapshotDir: SNAPSHOT_DIR })
@Table({ tableName: 'aggregate_replay_doc_number_settings', timestamps: false })
class DocNumberSettingModel extends Model {
  @Column(DataType.INTEGER)
  shop_id: number;

  @Column(DataType.TEXT)
  doc_type: string;

  @Column(DataType.TEXT)
  first_number: string;
}

// Bind models to an offline Sequelize instance (emulates what the app's connector
// does in record mode; the constructor performs no I/O). Model init() invokes
// wrapped statics internally (e.g. getTableName), so bind in 'off' mode — replay
// lookups must only be exercised inside the tests.
{
  const bindingMode = SnapshotStore.mode;
  SnapshotStore.setMode(MODE_OFF);
  new Sequelize({
    ...PG,
    dialect: 'postgres' as const,
    models: [OrderListModel, DocNumberSettingModel],
  });
  SnapshotStore.setMode(bindingMode);
}

/**
 * Seeds a static call entry into a model's cached store — the SAME store instance the
 * `@Mockable` static wrappers captured at decoration time (release/recreate would break the
 * identity: the wrappers keep a reference to the original store). `refs` undefined → the
 * entry stays field-less exactly like a legacy v1 file (legacy reconstruction path);
 * `refs` explicitly `null` marks a raw/plain record (result stays as-is on replay).
 * In-memory seeding deliberately bypasses `record()`'s v2 `refs ?? null` normalization.
 */
const recordStatic = (
  snapshotClass: string,
  name: string,
  query: unknown,
  result: unknown,
  refs?: unknown,
): void => {
  const store = getSnapshotStore(snapshotClass, SNAPSHOT_DIR);
  const call: SnapshotCall = {
    args: [serialize(query)],
    result: serialize(result),
    error: undefined,
  };
  if (refs !== undefined) call.refs = refs;
  const internal = store as unknown as {
    data: { calls: Record<string, SnapshotCall> };
    callSeq: Map<string, SnapshotCall[]>;
  };
  const key = makeCallKey('', name, [query]);
  internal.data.calls[key] = call;
  internal.callSeq.set(key, [call]);
};

const initialMode = SnapshotStore.mode;

beforeAll(() => {
  SnapshotStore.setMode(MODE_REPLAY);
});

afterAll(() => {
  SnapshotStore.setMode(initialMode);
  rmSync(SNAPSHOT_DIR, { recursive: true, force: true });
});

const shape = (v: unknown) => ({
  isModel: v instanceof Model,
  dv: (v as { dataValues?: unknown } | null)?.dataValues,
});

describe('aggregate findOne replay: real Model instances with populated dataValues', () => {
  it('replays a recorded aggregate findOne with a real Model and populated dataValues', async () => {
    const aggregateQuery = { where: { shop_id: 35, order_type: 2 } };
    recordStatic('OrderListModel', 'findOne', aggregateQuery, { number: 954 }, 'ref_1');

    const aggregate = (await OrderListModel.findOne(
      aggregateQuery,
    )) as (Model & { dataValues: Record<string, unknown> }) | null;
    const r1 = shape(aggregate);
    expect(r1.isModel).toBe(true);
    expect((r1.dv as Record<string, unknown>).number).toBe(954);

    const emptyQuery = { where: { shop_id: 99, order_type: 2 } };
    recordStatic('OrderListModel', 'findOne', emptyQuery, { number: null }, 'ref_2');

    const empty = (await OrderListModel.findOne(
      emptyQuery,
    )) as (Model & { dataValues: Record<string, unknown> }) | null;
    const r2 = shape(empty);
    expect(r2.isModel).toBe(true);
    expect((r2.dv as Record<string, unknown>).number).toBeNull();

    const settingQuery = { where: { shop_id: 35, doc_type: 'PKO' } };
    recordStatic('DocNumberSettingModel', 'findOne', settingQuery, { first_number: '30' }, 'ref_3');

    const setting = (await DocNumberSettingModel.findOne(
      settingQuery,
    )) as (Model & { dataValues: Record<string, unknown> }) | null;
    const r3 = shape(setting);
    expect(r3.isModel).toBe(true);
    expect((r3.dv as Record<string, unknown>).first_number).toBe('30');

    // raw:true record → refs === null → plain object, no dataValues, not a Model.
    const rawQuery = { where: { shop_id: 35, order_type: 2 }, raw: true };
    recordStatic('OrderListModel', 'findOne', rawQuery, { id: 1, order_number: 954 }, null);

    const rawRow = await OrderListModel.findOne(rawQuery);
    expect(rawRow).toEqual({ id: 1, order_number: 954 });
    expect(shape(rawRow).isModel).toBe(false);
  });
});