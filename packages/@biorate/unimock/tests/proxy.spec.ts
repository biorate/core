import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { existsSync, mkdirSync, readFileSync, rmSync } from 'fs';
import { join } from 'path';
import { Mockable, Unimock, flushAllSnapshots } from '../src';

const SNAPSHOT_DIR = join(__dirname, '__snapshots__');

class CounterService {
  public calls = 0;

  public add(a: number, b: number) {
    this.calls += 1;
    return a + b;
  }

  public inner() {
    return {
      transform: (value: string) => `ok:${value}`,
    };
  }
}

@Mockable({ snapshotDir: SNAPSHOT_DIR })
class MockedCounter extends CounterService {}

describe('@biorate/unimock', () => {
  const snapshotPath = join(SNAPSHOT_DIR, 'MockedCounter.unimock.json');

  beforeAll(() => {
    mkdirSync(SNAPSHOT_DIR, { recursive: true });
    process.env.UNIMOCK = '1';
  });

  afterAll(() => {
    Unimock.flush();
    delete process.env.UNIMOCK;
    delete process.env.UNIMOCK_UPDATE;
    delete process.env.UNIMOCK_LIVE;
  });

  it('records and replays method calls', async () => {
    rmSync(snapshotPath, { force: true });
    delete process.env.UNIMOCK_LIVE;

    const live = new MockedCounter();
    expect(live.add(2, 3)).toBe(5);
    expect(live.inner().transform('x')).toBe('ok:x');
    expect(live.calls).toBe(1);
    Unimock.flush();
    expect(existsSync(snapshotPath)).toBe(true);

    const replay = new MockedCounter();
    expect(replay.add(2, 3)).toBe(5);
    expect(replay.inner().transform('x')).toBe('ok:x');
  });

  it('skips initialize in replay mode', async () => {
    class InfraBase {
      public connected = false;

      public async initialize() {
        this.connected = true;
      }

      public ping() {
        return 'pong';
      }
    }

    @Mockable({ snapshotDir: SNAPSHOT_DIR })
    class MockedInfra extends InfraBase {}

    const infraSnapshot = join(SNAPSHOT_DIR, 'MockedInfra.unimock.json');
    rmSync(infraSnapshot, { force: true });

    const recorder = new MockedInfra();
    await recorder.initialize();
    expect(recorder.connected).toBe(true);
    expect(recorder.ping()).toBe('pong');
    Unimock.flush();

    const player = new MockedInfra();
    await player.initialize();
    expect(player.connected).toBe(false);
    expect(player.ping()).toBe('pong');
  });
});
