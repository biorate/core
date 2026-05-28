/**
 * @deprecated Not used anymore - decorator always falls back to real method
 */
export class MissingSnapshotError extends Error {
  constructor(methodPath: string) {
    super(`No snapshot for ${methodPath}`);
  }
}
