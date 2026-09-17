import { mkdtempSync, rmSync, statSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterAll, describe, expect, it } from 'vitest';
import { SnapshotStore, serialize } from '../src';

const dirs: string[] = [];
const mkdir = (): string => {
  const d = mkdtempSync(join(tmpdir(), 'unimock-dedup-'));
  dirs.push(d);
  return d;
};
afterAll(() => {
  for (const d of dirs) rmSync(d, { recursive: true, force: true });
});

// Build an array of N identical row objects.
const rows = (n: number) =>
  Array.from({ length: n }, () => ({ oid: 'abc', amount: 123 }));

describe('nested content-address pooling (T2.2)', () => {
  it('dedups repeated identical rows: deep-equal round-trip AND smaller snapshot', () => {
    const arr = rows(2000);
    const call = { args: [serialize(arr)], result: serialize('ok') };

    // A) with default pooling (UNIMOCK_VALUE_POOL on)
    const dirOn = mkdir();
    const storeOn = new SnapshotStore('DedupOn', dirOn);
    process.env.UNIMOCK_ROW_POOL = '1';
    try {
      storeOn.record('call:1', call);
      storeOn.flush();
    } finally {
      delete process.env.UNIMOCK_ROW_POOL;
    }
    const onPath = storeOn.snapshotPath;
    const sizeOn = statSync(onPath).size;

    // B) with pooling disabled
    process.env.UNIMOCK_VALUE_POOL = '0';
    const dirOff = mkdir();
    const storeOff = new SnapshotStore('DedupOff', dirOff);
    storeOff.record('call:1', call);
    storeOff.flush();
    const sizeOff = statSync(storeOff.snapshotPath).size;
    delete process.env.UNIMOCK_VALUE_POOL;

    // Fresh re-load of the ON snapshot must reproduce the EXACT original value.
    const relaod = new SnapshotStore('DedupOn', dirOn);
    const got = relaod.get('call:1');
    expect(got?.result).toEqual({ t: 'string', v: 'ok' });
    // args[0] should deep-equal the original serialized array (nested refs expanded)
    expect(got?.args?.[0]).toEqual(serialize(arr));

    // Materially smaller with pooling.
    expect(sizeOn).toBeLessThan(sizeOff);
    // Report
    // eslint-disable-next-line no-console
    console.log(`T2.2 size: with-pool=${sizeOn} bytes, no-pool=${sizeOff} bytes, ratio=${(sizeOff / sizeOn).toFixed(1)}x`);
  });
});
