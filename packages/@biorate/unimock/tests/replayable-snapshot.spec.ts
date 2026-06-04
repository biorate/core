import { afterAll, afterEach, describe, expect, it } from 'vitest';
import { mkdirSync, rmSync, writeFileSync } from 'fs';
import { join } from 'path';
import {
  DEFAULT_SNAPSHOT_DIR,
  isUnimockEnabled,
  parseUnimockEnv,
  resolveMode,
} from '../src/env';
import { isReplayableSnapshotFile } from '../src/snapshot-path';

const DIR = join(process.cwd(), DEFAULT_SNAPSHOT_DIR, 'replayable');

describe('replayable snapshot', () => {
  const path = join(DIR, 'Test.unimock.json');

  afterEach(() => {
    delete process.env.UNIMOCK;
    delete process.env.UNIMOCK_UPDATE;
    delete process.env.UNIMOCK_LIVE;
  });

  afterAll(() => rmSync(DIR, { recursive: true, force: true }));

  it('defaults to off when UNIMOCK is unset', () => {
    expect(parseUnimockEnv()).toBe('off');
    expect(isUnimockEnabled()).toBe(false);
    mkdirSync(DIR, { recursive: true });
    writeFileSync(
      path,
      JSON.stringify({
        version: 1,
        className: 'Test',
        calls: { 'root|ping|0': { args: [], result: { kind: 'void' } } },
      }),
    );
    expect(resolveMode(path, 'Test')).toBe('record');
  });

  it('auto: missing or empty snapshot → record, non-empty → replay', () => {
    process.env.UNIMOCK = 'auto';
    mkdirSync(DIR, { recursive: true });
    rmSync(path, { force: true });
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

  it('record: always record even when snapshot is replayable', () => {
    process.env.UNIMOCK = 'record';
    mkdirSync(DIR, { recursive: true });
    writeFileSync(
      path,
      JSON.stringify({
        version: 1,
        className: 'Test',
        calls: { 'root|ping|0': { args: [], result: { kind: 'void' } } },
      }),
    );
    expect(resolveMode(path, 'Test')).toBe('record');
  });

  it('replay: always replay regardless of file contents', () => {
    process.env.UNIMOCK = 'replay';
    mkdirSync(DIR, { recursive: true });
    expect(resolveMode(path, 'Test')).toBe('replay');
  });

  it('maps legacy UNIMOCK_UPDATE to record', () => {
    process.env.UNIMOCK_UPDATE = '1';
    expect(parseUnimockEnv()).toBe('record');
  });

  it('maps legacy UNIMOCK_LIVE to off', () => {
    process.env.UNIMOCK_LIVE = '1';
    expect(parseUnimockEnv()).toBe('off');
  });
});
