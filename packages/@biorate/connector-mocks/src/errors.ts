import { BaseError } from '@biorate/errors';

/**
 * @description Error thrown when snapshot is not found in replay mode
 */
export class MissingSnapshotError extends BaseError {
  constructor(methodPath: string) {
    super(`No snapshot for %s. Run in 'record' mode first.`, [methodPath]);
  }
}

/**
 * @description Error thrown when Vitest is not initialized
 */
export class VitestNotInitializedError extends BaseError {
  constructor() {
    super('Vitest not initialized. Make sure vitest is imported.');
  }
}
