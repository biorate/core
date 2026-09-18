import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import {
  BelongsToMany,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  Sequelize,
  Table,
} from '@biorate/sequelize';
import {
  MODE_OFF,
  MODE_RECORD,
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
 * Regression tests for included-association rehydration on static replay (T3.2
 * 066 `POST /cashier/info` 503 / 036 hang).
 *
 * `rebuildInstance` reconstructs a recorded static result via the original
 * `build(plain, { isNewRecord: false })`. `build` only materialises scalar column
 * attributes — included associations present in `plain` (e.g. `roles` on a
 * `findOne({ include })` result) were silently dropped, so `instance.roles ===
 * undefined` even though the recorded payload carried them. Replay reconstruction
 * must feed the association keys through Sequelize's own `_setInclude` hydration
 * (the same `include` / `includeNames` / `includeMap` options a live query result
 * uses), so `instance[alias]`, `instance.dataValues[alias]` and
 * `instance.get(alias)` all resolve, recursively for nested includes.
 *
 * Snapshot entries are injected directly into the model's own store (the call key
 * is computed with the same `makeCallKey` the wrapper uses), so the tests run
 * fully offline and deterministically in replay mode. Models are bound to an
 * offline Sequelize instance (the constructor performs no I/O).
 */

const SNAPSHOT_DIR = mkdtempSync(join(tmpdir(), 'unimock-assoc-'));

const SNAPSHOT_CLASS = 'AssocEmpModel';

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
@Table({ tableName: 'assoc_emp_role', timestamps: false })
export class AssocEmpRoleModel extends Model {
  @ForeignKey(() => AssocEmpModel)
  @Column({ type: DataType.CHAR, allowNull: false })
  employee_id: string;

  @ForeignKey(() => AssocRoleModel)
  @Column({ type: DataType.INTEGER, allowNull: false })
  role_id: number;
}

@Mockable({ statics: [SEQUELIZE_STATICS], snapshotDir: SNAPSHOT_DIR })
@Table({ tableName: 'assoc_politics', timestamps: false })
export class AssocPoliticsModel extends Model {
  @Column({ type: DataType.INTEGER, primaryKey: true })
  politics_id: number;

  @ForeignKey(() => AssocRoleModel)
  @Column({ type: DataType.INTEGER, allowNull: false })
  role_id: number;

  @Column(DataType.STRING)
  name: string;
}

@Mockable({ statics: [SEQUELIZE_STATICS], snapshotDir: SNAPSHOT_DIR })
@Table({ tableName: 'assoc_role', timestamps: false })
export class AssocRoleModel extends Model {
  @Column({ type: DataType.INTEGER, primaryKey: true })
  role_id: number;

  @Column(DataType.STRING)
  name: string;

  @HasMany(() => AssocPoliticsModel)
  politics: AssocPoliticsModel[];
}

@Mockable({ statics: [SEQUELIZE_STATICS], snapshotDir: SNAPSHOT_DIR })
@Table({ tableName: 'assoc_emp', timestamps: false })
export class AssocEmpModel extends Model {
  @Column({ type: DataType.CHAR, primaryKey: true })
  ldap: string;

  @Column(DataType.BOOLEAN)
  active: boolean;

  @BelongsToMany(() => AssocRoleModel, () => AssocEmpRoleModel)
  roles: AssocRoleModel[];
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
    models: [AssocEmpModel, AssocRoleModel, AssocPoliticsModel, AssocEmpRoleModel],
  });
  SnapshotStore.setMode(bindingMode);
}

const PLAIN_EMPLOYEE: Record<string, unknown> = {
  ldap: '60032113',
  active: true,
  roles: [
    {
      role_id: 3,
      name: 'admin',
      politics: [
        { politics_id: 11, role_id: 3, name: 'approve' },
        { politics_id: 12, role_id: 3, name: 'cancel' },
      ],
    },
    { role_id: 7, name: 'cashier', politics: [] },
  ],
};

const QUERY = { where: { ldap: '60032113' } };

/**
 * Seeds a static call entry into the model's cached store — the SAME store instance the
 * `@Mockable` static wrappers captured at decoration time (release/recreate would break the
 * identity: the wrappers keep a reference to the original store). `refs` undefined → the
 * entry stays field-less exactly like a legacy v1 file (legacy reconstruction path); a
 * supplied `refs` exercises the refs-registered path. In-memory seeding deliberately bypasses
 * `record()`'s v2 `refs ?? null` normalization.
 */
const recordStatic = (
  name: string,
  query: unknown,
  result: unknown,
  refs?: unknown,
): void => {
  const store = getSnapshotStore(SNAPSHOT_CLASS, SNAPSHOT_DIR);
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

/** Structural view of a replay-rebuilt model instance (avoids Model generics noise). */
interface RebuiltInstance {
  get(key: string): unknown;
  toJSON(): Record<string, unknown>;
  dataValues: Record<string, unknown>;
  getRoles: unknown;
  roles?: Record<string, unknown>[];
}

interface RebuiltRole {
  role_id: number;
  name: string;
  politics: { politics_id: number; name: string }[];
}

describe('static replay — included association rehydration', () => {
  it('hydrates a BelongsToMany include with nested HasMany from a recorded findOne', async () => {
    recordStatic('findOne', QUERY, PLAIN_EMPLOYEE);

    const found = (await AssocEmpModel.findOne(QUERY)) as unknown as RebuiltInstance;

    expect(found).toBeInstanceOf(Model);
    expect(found).toBeInstanceOf(AssocEmpModel);

    // Scalar columns are reconstructed as before.
    expect(found.get('ldap')).toBe('60032113');
    expect(found.get('active')).toBe(true);

    // The included association must be hydrated (previously: undefined).
    expect(found.roles).toBeDefined();
    expect(Array.isArray(found.roles)).toBe(true);
    expect(found.roles).toHaveLength(2);

    // Nested included data (roles[].politics) is present and hydrated.
    const [admin, cashier] = found.roles as unknown as RebuiltRole[];
    expect(admin).toBeInstanceOf(AssocRoleModel);
    expect(admin.role_id).toBe(3);
    expect(admin.name).toBe('admin');
    expect(Array.isArray(admin.politics)).toBe(true);
    expect(admin.politics).toHaveLength(2);
    expect(admin.politics[0]).toBeInstanceOf(AssocPoliticsModel);
    expect(admin.politics[0].politics_id).toBe(11);
    expect(admin.politics[0].name).toBe('approve');
    expect(admin.politics[1].politics_id).toBe(12);
    expect(cashier.role_id).toBe(7);
    expect(cashier.politics).toEqual([]);

    // Accessor contract: `get(alias)` / `dataValues` resolve like a live instance.
    expect(found.get('roles')).toBe(found.roles);
    expect(found.dataValues.roles).toBe(found.roles);
    expect(typeof found.getRoles).toBe('function');

    // Unrecorded instance methods on a rebuilt, unregistered instance fall back
    // to their original implementation — toJSON() must round-trip the recorded shape.
    expect(found.toJSON()).toEqual(PLAIN_EMPLOYEE);
  });

  it('hydrates associations when the snapshot entry carries instance refs (066 shape)', async () => {
    const query = { where: { ldap: '60032114' } };
    recordStatic('findOne', query, { ...PLAIN_EMPLOYEE, ldap: '60032114' }, 'ref_468');

    const found = (await AssocEmpModel.findOne(query)) as unknown as RebuiltInstance;

    expect(found).toBeInstanceOf(AssocEmpModel);
    // Own-property association access is refId-agnostic (the 066 DTO reads `.roles`
    // directly); wrapped instance methods on a ref-registered instance stay strict.
    expect(found.roles).toHaveLength(2);
    expect(found.roles?.[0].politics).toHaveLength(2);
    expect(typeof found.getRoles).toBe('function');
  });

  it('hydrates per-element on recorded findAll, including empty-association rows', async () => {
    const query = { where: { active: true } };
    recordStatic('findAll', query, [
      PLAIN_EMPLOYEE,
      { ldap: '60032115', active: true, roles: [] },
    ]);

    const rows = (await AssocEmpModel.findAll(query)) as unknown as RebuiltInstance[];

    expect(rows).toHaveLength(2);
    expect(rows[0].roles).toHaveLength(2);
    // An empty recorded association stays an (empty) array, not undefined.
    expect(rows[1].roles).toEqual([]);
    expect(rows[1].get('ldap')).toBe('60032115');
  });

  it('keeps scalar-only records unchanged (no association keys -> no hydration)', async () => {
    const query = { where: { ldap: '60032116' } };
    recordStatic('findOne', query, { ldap: '60032116', active: false });

    const found = (await AssocEmpModel.findOne(query)) as unknown as RebuiltInstance;

    expect(found).toBeInstanceOf(AssocEmpModel);
    expect(found.get('ldap')).toBe('60032116');
    expect(found.get('active')).toBe(false);
    // Without an include in the record, the association stays absent (legacy shape).
    expect(found.roles).toBeUndefined();
    expect(found.toJSON()).toEqual({ ldap: '60032116', active: false });
  });
});
