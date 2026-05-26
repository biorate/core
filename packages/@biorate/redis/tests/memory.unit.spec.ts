import { expect } from 'vitest';
import { Core, inject } from '@biorate/inversion';
import { RedisConnector } from '@biorate/redis';
import { createTestHarness, setupBiorateTest } from '@biorate/testing';

class Root extends Core() {
  @inject(RedisConnector) public connector!: RedisConnector;
}

const harness = createTestHarness({
  root: Root,
  profile: 'memory',
  connectors: ['redis'],
});

setupBiorateTest(harness);

describe('@biorate/redis memory', () => {
  it('set and get', async () => {
    await harness.root.connector.current!.set('key', 'value');
    expect(await harness.root.connector.current!.get('key')).toBe('value');
    expect(await harness.root.connector.current!.del('key')).toBe(1);
  });
});
