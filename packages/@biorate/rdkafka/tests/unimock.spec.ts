import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { Unimock } from '@biorate/unimock';
import { getTestRoot, Root } from './__mocks__/unimock';

describe('@biorate/rdkafka with Unimock', () => {
  let root: Root;

  beforeAll(async () => {
    process.env.UNIMOCK = 'record';
    root = getTestRoot();
    await root.$run();
  });

  afterAll(() => {
    Unimock.flush();
    process.env.UNIMOCK = '';
  });

  it('should mock admin connector', async () => {
    expect(Unimock.isMockable(root.admin)).toBe(true);
  });

  it('should mock producer connector', async () => {
    expect(Unimock.isMockable(root.producer)).toBe(true);
  });

  it('should mock consumer connector', async () => {
    expect(Unimock.isMockable(root.consumer)).toBe(true);
  });
});
