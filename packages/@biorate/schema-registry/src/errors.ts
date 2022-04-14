import { BaseError } from '@biorate/errors';

export class SchemaRegistryCantConnectError extends BaseError {
  public constructor(e: Error) {
    super(`Can't connect to schema registry: [%s]`, [e.message]);
  }
}

export class SchemaRegistryAvroSchemaParseError extends BaseError {
  public constructor(errors: string[]) {
    super('%s', [errors.join('; ')], {
      status: 400,
    });
  }
}
