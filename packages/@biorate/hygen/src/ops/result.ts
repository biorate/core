import type { ActionResult } from '../types';

/**
 * @description Factory for an operation outcome recorder. Returns a function
 * that, given a status and optional payload, produces an `ActionResult` with
 * `type`, `subject`, `status`, timing and optional payload.
 * @param type - The operation type (e.g. `add`, `inject`, `shell`).
 * @param subject - The operation subject (e.g. target path).
 * @param start - Start timestamp used to compute the timing (defaults to now).
 * @returns A recorder producing a full action result for a given status.
 * */
export default (type: string, subject?: unknown, start: Date = new Date()) =>
  (status: string, payload: unknown = null, end: Date = new Date()): ActionResult => ({
    type,
    subject,
    status,
    timing: end.getTime() - start.getTime(),
    ...(payload ? { payload } : {}),
  });
