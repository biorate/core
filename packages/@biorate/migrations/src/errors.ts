import { BaseError } from '@biorate/errors';

export class SchemaRegistryWrongFileNameError extends BaseError {
  public constructor(name: string) {
    super(`Schema registry wrong filename: [%s], pattern: "00001_filename.avsc.json"`, [
      name,
    ]);
  }
}
