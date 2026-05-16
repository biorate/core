import { BaseError } from '@biorate/errors';

/** @description Error thrown when UInt29 value is out of bounds */
export class UInt29OutOfBoundsError extends BaseError {
  public constructor(value: number, max: number, min: number) {
    super('UInt29 value is out of bounds [%s], shoud be >= [%s], and <= [%s]', [
      value,
      min,
      max,
    ]);
  }
}

/** @description Error thrown when time format string is incorrect */
export class TimeIncorrectFormatError extends BaseError {
  public constructor(format: string) {
    super('Time incorrect format: [%s]', [format]);
  }
}
