import { BaseError } from '@biorate/errors';

export class SchemaRegistryCantConnectError extends BaseError {
  public constructor(e: Error) {
    super(`Can't connect to schema registry: [%s]`, [e.message]);
  }
}
