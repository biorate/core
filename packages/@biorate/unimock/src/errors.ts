import { BaseError } from '@biorate/errors';

export class UnimockReplayMissError extends BaseError {
  public constructor(callKey: string, method: string, args: unknown[]) {
    super(
      `Unimock replay miss: no snapshot found for call "${callKey}" ` +
        `(method "${method}", args: ${JSON.stringify(args)}). ` +
        `Run with UNIMOCK=record to create snapshots.`,
    );
  }
}

export class UnimockSerializeError extends BaseError {
  public constructor(message: string, meta?: unknown) {
    super(message, meta ? [meta] : undefined);
  }
}

export class UnimockConnectionHandlerTargetRequiredError extends BaseError {
  public constructor(refId: string) {
    super('ConnectionHandler: target required in record mode (refId: %s)', [refId]);
  }
}
