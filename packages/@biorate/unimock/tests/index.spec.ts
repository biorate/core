import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { Mockable, Unimock, configureUnimock } from '../src';

@Mockable({ snapshotName: 'Calculator' })
class Calculator {
  public add(a: number, b: number) {
    return a + b;
  }

  public async mul(a: number, b: number) {
    return a * b;
  }
}

function readSnapshotFile(snapshotDir: string) {
  const p = path.join(snapshotDir, 'Calculator.unimock.json');
  return JSON.parse(fs.readFileSync(p, 'utf8')) as { version: number; calls: any[] };
}

describe('@biorate/unimock', () => {
  it('records and replays by args signature without breaking sync return types', async () => {
    const snapshotDir = fs.mkdtempSync(path.join(os.tmpdir(), 'unimock-'));
    configureUnimock({ snapshotDir, mode: 'auto' });

    const calc = new Calculator();

    Unimock.setTestName('records');

    const v1 = calc.add(1, 2);
    expect(v1).toBe(3);

    const v2 = await calc.mul(2, 3);
    expect(v2).toBe(6);

    Unimock.flush();

    const snap1 = readSnapshotFile(snapshotDir);
    expect(snap1.calls.length).toBe(2);

    Unimock.setTestName('records');

    const v1Replay = calc.add(1, 2);
    expect(v1Replay).toBe(3);

    const v2Replay = await calc.mul(2, 3);
    expect(v2Replay).toBe(6);
  });
});

