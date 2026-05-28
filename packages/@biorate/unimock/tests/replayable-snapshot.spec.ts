import { afterAll, describe, expect, it } from 'vitest';
import { existsSync, mkdirSync, rmSync, writeFileSync } from 'fs';
import { join } from 'path';
import { DEFAULT_SNAPSHOT_DIR, resolveMode } from '../src/env';
import { isReplayableSnapshotFile } from '../src/snapshot-path';

const DIR = join(process.cwd(), DEFAULT_SNAPSHOT_DIR, 'replayable');

describe('replayable snapshot', () => {
  const path = join(DIR, 'Test.unimock.json');

  afterAll(() => rmSync(DIR, { recursive: true, force: true }));

  it('treats missing or empty snapshot as record mode', () => {
    mkdirSync(DIR, { recursive: true });
    expect(resolveMode(path, 'Test')).toBe('record');

    writeFileSync(
      path,
      JSON.stringify({ version: 1, className: 'Test', calls: {} }),
    );
    expect(isReplayableSnapshotFile(path, 'Test')).toBe(false);
    expect(resolveMode(path, 'Test')).toBe('record');

    writeFileSync(
      path,
      JSON.stringify({
        version: 1,
        className: 'Test',
        calls: { 'root|ping|0': { args: [], result: { kind: 'void' } } },
      }),
    );
    expect(isReplayableSnapshotFile(path, 'Test')).toBe(true);
    expect(resolveMode(path, 'Test')).toBe('replay');
  });
});
