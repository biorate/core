import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterAll, describe, expect, it } from 'vitest';
import { MockHandler, SnapshotStore } from '../src';

/**
 * Regression tests for iterator protocol replay (T3.2 replay hang).
 *
 * `next()` is stateful: the recorded sequence of results is the iteration itself. A
 * stateless last-wins replay repeats the last recorded result forever when the recorded
 * iteration was interrupted early (return/break) and no `done: true` entry exists,
 * producing an infinite loop in the replaying test. Replay must therefore yield the
 * recorded `next()` results in order and terminate with a synthetic
 * `{ value: undefined, done: true }` once the sequence is exhausted.
 *
 * Snapshot files live in per-test `os.tmpdir()` directories, removed in `afterAll`.
 */

const tmpDirs: string[] = [];

const mkSnapshotDir = (): string => {
  const dir = mkdtempSync(join(tmpdir(), 'unimock-iter-'));
  tmpDirs.push(dir);
  return dir;
};

afterAll(() => {
  SnapshotStore.setMode('off');
  for (const dir of tmpDirs) rmSync(dir, { recursive: true, force: true });
});

describe('iterator next() replay', () => {
  it('replays an interrupted recorded iteration (no done:true) and terminates', () => {
    const dir = mkSnapshotDir();
    const values = [10, 20, 30];
    let i = 0;
    const iter = { next: () => ({ value: values[i++], done: false }) };
    const target = { [Symbol.iterator]: () => iter };

    SnapshotStore.setMode('record');
    const store = new SnapshotStore('IterSvcInterrupted', dir);
    const conn = new MockHandler(target, 'conn_1', store) as any;
    const it = conn[Symbol.iterator]();
    // Flush after each step so the file accumulates the sequence history
    // (first flush is a full write, later flushes append re-recorded keys).
    it.next();
    store.flush();
    it.next();
    store.flush();
    it.next();
    store.flush();

    SnapshotStore.setMode('replay');
    const store2 = new SnapshotStore('IterSvcInterrupted', dir);
    // for..of on the iterable proxy: [Symbol.iterator]() once, then next() per item —
    // the same access pattern as the hanging app code.
    const replayConn = new MockHandler(null, 'conn_1', store2) as any;
    const seen: number[] = [];
    for (const value of replayConn) seen.push(value);
    expect(seen).toEqual([10, 20, 30]);
  });

  it('replays a naturally exhausted iteration (recorded done:true) in order', () => {
    const dir = mkSnapshotDir();
    // A real iteration that yields [1, 2] records three next() results — the
    // terminal {undefined, true} terminates the for..of without yielding a value.
    const results = [
      { value: 1, done: false },
      { value: 2, done: false },
      { value: undefined, done: true },
    ];
    let i = 0;
    const iter = { next: () => results[i++] };
    const target = { [Symbol.iterator]: () => iter };

    SnapshotStore.setMode('record');
    const store = new SnapshotStore('IterSvcExhausted', dir);
    const conn = new MockHandler(target, 'conn_1', store) as any;
    const it = conn[Symbol.iterator]();
    it.next();
    store.flush();
    it.next();
    store.flush();
    it.next();
    store.flush();

    SnapshotStore.setMode('replay');
    const store2 = new SnapshotStore('IterSvcExhausted', dir);
    const replayConn = new MockHandler(null, 'conn_1', store2) as any;
    const seen: number[] = [];
    for (const value of replayConn) seen.push(value);
    expect(seen).toEqual([1, 2]);
  });

  it('terminates on a legacy single-entry snapshot without sequence history', () => {
    const dir = mkSnapshotDir();
    const iter = { next: () => ({ value: 7, done: false }) };
    const target = { [Symbol.iterator]: () => iter };

    SnapshotStore.setMode('record');
    const store = new SnapshotStore('IterSvcLegacy', dir);
    const conn = new MockHandler(target, 'conn_1', store) as any;
    const it = conn[Symbol.iterator]();
    it.next();
    store.flush();

    SnapshotStore.setMode('replay');
    const store2 = new SnapshotStore('IterSvcLegacy', dir);
    const replayConn = new MockHandler(null, 'conn_1', store2) as any;
    const seen: number[] = [];
    for (const value of replayConn) seen.push(value);
    expect(seen).toEqual([7]);
  });

  it('keeps last-wins replay for non-iterator methods named next', () => {
    const dir = mkSnapshotDir();
    const target = { next: () => ({ custom: 1 }) };

    SnapshotStore.setMode('record');
    const store = new SnapshotStore('IterSvcPlain', dir);
    const conn = new MockHandler(target, 'conn_1', store) as any;
    conn.next();
    store.flush();

    SnapshotStore.setMode('replay');
    const store2 = new SnapshotStore('IterSvcPlain', dir);
    const replayConn = new MockHandler(null, 'conn_1', store2) as any;
    expect(replayConn.next()).toEqual({ custom: 1 });
    expect(replayConn.next()).toEqual({ custom: 1 });
  });
});
