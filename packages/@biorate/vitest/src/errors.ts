import { BaseError } from '@biorate/errors';

/** @description Error thrown when both @skip() and @only() decorators are used on the same target */
export class VitestBothSkipOnlyError extends BaseError {
  public constructor(target: string) {
    super(
      `[vitest] Cannot use both @skip() and @only() decorators on the same ${target}`,
    );
  }
}

/** @description Error thrown when @timeout() receives an invalid value */
export class VitestTimeoutInvalidError extends BaseError {
  public constructor(ms: number) {
    super(`[vitest] @timeout() requires a positive number, got: ${ms}`);
  }
}

/** @description Error thrown when @repeats() receives an invalid value */
export class VitestRepeatsInvalidError extends BaseError {
  public constructor(count: number) {
    super(`[vitest] @repeats() requires a positive number, got: ${count}`);
  }
}
