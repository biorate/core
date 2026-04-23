import { BaseError } from '@biorate/errors';

export class VitestDecoratorError extends BaseError {
  public constructor(message: string) {
    super(`[vitest] ${message}`);
  }
}

export class VitestBothSkipOnlyError extends BaseError {
  public constructor(target: string) {
    super(
      `[vitest] Cannot use both @skip() and @only() decorators on the same ${target}`,
    );
  }
}

export class VitestTimeoutInvalidError extends BaseError {
  public constructor(ms: number) {
    super(`[vitest] @timeout() requires a positive number, got: ${ms}`);
  }
}

export class VitestRepeatsInvalidError extends BaseError {
  public constructor(count: number) {
    super(`[vitest] @repeats() requires a positive number, got: ${count}`);
  }
}
