import { BaseError } from '@biorate/errors';

export class UnimockSnapshotNotFoundError extends BaseError {
  public constructor(className: string, snapshotName: string) {
    super(`Snapshot not found: [%s:%s]`, [className, snapshotName]);
  }
}

export class UnimockNotMockableError extends BaseError {
  public constructor(className: string, reason: string) {
    super(`Class is not mockable: [%s] - %s`, [className, reason]);
  }
}

export class UnimockInvalidModeError extends BaseError {
  public constructor(mode: string) {
    super(`Invalid UNIMOCK mode: [%s]. Allowed: record, replay, off`, [mode]);
  }
}
