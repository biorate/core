import type { ActionResult } from '../types';

export default (type: string, subject?: unknown, start: Date = new Date()) =>
  (status: string, payload: unknown = null, end: Date = new Date()): ActionResult => ({
    type,
    subject,
    status,
    timing: end.getTime() - start.getTime(),
    ...(payload ? { payload } : {}),
  });
