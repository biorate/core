import { BaseError } from '@biorate/errors';

export class UInt29OutOfBoundsError extends BaseError {
  public constructor(value: number, max: number, min: number) {
    super('UInt29 value is out of bounds [%s], shoud be >= [%s], and <= [%s]', [
      value,
      min,
      max,
    ]);
  }
}

export class TimeIncorrectFormatError extends BaseError {
  public constructor(format: string) {
    super('Time incorrect format: [%s]', [format]);
  }
}
