import { BaseError } from '@biorate/errors';

export class ConnectorMultiplyInstanceError extends BaseError {
  public constructor(name: string) {
    super(`Connector [%s] multiply instance created`, [name]);
  }
}
