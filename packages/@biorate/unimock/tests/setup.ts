import { afterAll, beforeAll } from 'vitest';
import { flushAllSnapshots } from '../src';

beforeAll(() => {});

afterAll(() => {
  flushAllSnapshots();
});
