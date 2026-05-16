import { BaseError } from '@biorate/errors';

/** @description Error thrown when connection to schema registry fails */
export class SchemaRegistryCantConnectError extends BaseError {
  public constructor(e: Error) {
    super(`Can't connect to schema registry: [%s]`, [e.message]);
  }
}

/** @description Error thrown when Avro schema parsing fails */
export class SchemaRegistryAvroSchemaParseError extends BaseError {
  public constructor(errors: string[]) {
    super('%s', [errors.join('; ')], {
      status: 400,
    });
  }
}
