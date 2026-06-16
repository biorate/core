import { afterAll, beforeEach } from 'vitest';
import { Unimock } from '../runtime/Unimock';

beforeEach((ctx) => {
  Unimock.setTestName(ctx.task.name);
});

afterAll(() => {
  Unimock.flush();
});

