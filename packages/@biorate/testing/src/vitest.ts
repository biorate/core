import { afterAll, beforeAll } from 'vitest';
import type { ITestHarness, TestRootInstance } from './harness';

/** @description Registers Vitest hooks for a Biorate test harness. */
export function setupBiorateTest<TRoot extends TestRootInstance>(
  harness: ITestHarness<TRoot>,
) {
  beforeAll(async () => {
    await harness.run();
  });

  afterAll(() => {
    harness.dispose();
  });
}
