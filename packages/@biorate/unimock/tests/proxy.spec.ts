import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { existsSync, mkdirSync, rmSync } from 'fs';
import { join } from 'path';
import { DEFAULT_SNAPSHOT_DIR, Mockable, Unimock, unwrapMockTarget } from '../src';

const SNAPSHOT_DIR = join(process.cwd(), DEFAULT_SNAPSHOT_DIR);

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

  public payload() {
    return { data: [{ value: 42 }] };
  }
}

@Mockable()
class MockedCounter extends CounterService {}

describe('@biorate/unimock', () => {
  const snapshotPath = join(SNAPSHOT_DIR, 'MockedCounter.unimock.json');

  beforeAll(() => {
    mkdirSync(SNAPSHOT_DIR, { recursive: true });
    process.env.UNIMOCK = 'auto';
  });

  afterAll(() => {
    Unimock.flush();
    delete process.env.UNIMOCK;
    delete process.env.UNIMOCK_UPDATE;
    delete process.env.UNIMOCK_LIVE;
  });

  it('does not wrap instances when UNIMOCK is off', () => {
    delete process.env.UNIMOCK;
    const instance = new MockedCounter();
    expect(unwrapMockTarget(instance)).toBe(instance);
    expect(instance.add(1, 2)).toBe(3);
    expect(instance.calls).toBe(1);
    process.env.UNIMOCK = 'auto';
  });

  it('records and replays method calls', async () => {
    process.env.UNIMOCK = 'auto';
    rmSync(snapshotPath, { force: true });

    const recorder = new MockedCounter();
    expect(recorder.add(2, 3)).toBe(5);
    expect(recorder.inner().transform('x')).toBe('ok:x');
    expect(recorder.calls).toBe(1);
    Unimock.flush();
    expect(existsSync(snapshotPath)).toBe(true);

    const replay = new MockedCounter();
    expect(replay.add(2, 3)).toBe(5);
    expect(replay.inner().transform('x')).toBe('ok:x');
  });

  it('records SDK client chains without serializing opaque handles', async () => {
    process.env.UNIMOCK = 'auto';
    const sdkSnapshot = join(SNAPSHOT_DIR, 'MockedSdkClient.unimock.json');
    rmSync(sdkSnapshot, { force: true });

    class SdkClient {
      public readonly slotA = 1;
      public readonly slotB = 2;
      public readonly slotC = 3;
      public readonly slotD = 4;

      public query() {
        return {
          json: async () => ({ data: [{ result: 1 }] }),
          stream: async () => undefined,
        };
      }
    }

    @Mockable()
    class MockedSdkClient extends SdkClient {}

    const recorder = new MockedSdkClient();
    const cursor = recorder.query();
    const { data } = await cursor.json();
    expect(data[0].result).toBe(1);
    Unimock.flush();
    expect(existsSync(sdkSnapshot)).toBe(true);

    const replay = new MockedSdkClient();
    const replayCursor = replay.query();
    const { data: replayData } = await replayCursor.json();
    expect(replayData[0].result).toBe(1);
  });

  it('replays property access on object refs', () => {
    process.env.UNIMOCK = 'auto';
    const payloadSnapshot = join(SNAPSHOT_DIR, 'MockedPayload.unimock.json');
    rmSync(payloadSnapshot, { force: true });

    @Mockable()
    class MockedPayload extends CounterService {}

    const recorder = new MockedPayload();
    const { data: recorded } = recorder.payload();
    expect(recorded[0].value).toBe(42);
    Unimock.flush();

    const replay = new MockedPayload();
    const { data: replayed } = replay.payload();
    expect(replayed[0].value).toBe(42);
  });

  it('runs initialize on real target when class uses private fields', async () => {
    process.env.UNIMOCK = 'auto';

    class PrivateConnector {
      #ready = false;

      public async initialize() {
        this.#ready = true;
      }

      public isReady() {
        return this.#ready;
      }
    }

    @Mockable()
    class MockedPrivate extends PrivateConnector {}

    const instance = new MockedPrivate();
    await instance.initialize();
    expect(instance.isReady()).toBe(true);
  });

  it('skips initialize in replay mode', async () => {
    process.env.UNIMOCK = 'auto';

    class InfraBase {
      public connected = false;

      public async initialize() {
        this.connected = true;
      }

      public ping() {
        return 'pong';
      }
    }

    @Mockable()
    class MockedInfra extends InfraBase {}

    const infraSnapshot = join(SNAPSHOT_DIR, 'MockedInfra.unimock.json');
    rmSync(infraSnapshot, { force: true });

    const recorder = new MockedInfra();
    await recorder.initialize();
    expect(recorder.connected).toBe(true);
    expect(recorder.ping()).toBe('pong');
    Unimock.flush();
    expect(existsSync(infraSnapshot)).toBe(true);

    const player = new MockedInfra();
    await player.initialize();
    expect(player.connected).toBe(false);
    expect(player.ping()).toBe('pong');
  });
});
