import { afterAll } from 'vitest';
import { flushAllSnapshots } from '../snapshot-store';

afterAll(() => {
  flushAllSnapshots();
});
