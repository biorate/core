import { BaseError } from '@biorate/errors';

/** @description Thrown when replay mode has no matching snapshot entry for a call. */
export class UnimockReplayMissError extends BaseError {
  public constructor(callKey: string) {
    super(`Unimock replay miss for call [%s]`, [callKey]);
  }
}

/** @description Thrown when a value cannot be serialized into a snapshot. */
export class UnimockSerializeError extends BaseError {
  public constructor(message: string, meta?: unknown) {
    super(`Unimock serialize error: [%s]`, [message], meta);
  }
}
