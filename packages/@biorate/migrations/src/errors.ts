import { BaseError } from '@biorate/errors';

/** @description Thrown when a schema registry filename does not match the expected pattern. */
export class SchemaRegistryWrongFileNameError extends BaseError {
  public constructor(name: string) {
    super(`Schema registry wrong filename: [%s], pattern: "00001_filename.avsc.json"`, [
      name,
    ]);
  }
}
