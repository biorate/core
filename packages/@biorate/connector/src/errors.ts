import { BaseError } from '@biorate/errors';

export class ConnectorConnectionNotExistsError extends BaseError {
  public constructor(type: string, name: string) {
    super(`Connection not exists: [%s]:[%s]`, [type, name]);
  }
}
