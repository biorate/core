import { BaseError } from '@biorate/errors';

/**
 * @description Thrown during replay when a call key is not found in the snapshot store.
 *   Indicates the snapshot was recorded with different arguments or the method was not called
 *   during the recording phase.
 */
export class UnimockReplayMissError extends BaseError {
  public constructor(callKey: string, method: string, args: unknown[]) {
    super(
      `Unimock replay miss: no snapshot found for call "${callKey}" ` +
        `(method "${method}", args: ${JSON.stringify(args)}). ` +
        `Run with UNIMOCK=record to create snapshots.`,
    );
  }
}

/** @description Thrown when serialisation of a value fails (e.g. unsupported type or circular structure). */
export class UnimockSerializeError extends BaseError {
  public constructor(message: string, meta?: unknown) {
    super(message, meta ? [meta] : undefined);
  }
}

/**
 * @description Thrown when a {@link MockHandler} is used in record mode but its
 *   underlying target object is null.
 */
export class UnimockProxyTargetRequiredError extends BaseError {
  public constructor(refId: string) {
    super('MockHandler: target required in record mode (refId: %s)', [refId]);
  }
}
