import { BaseError } from '@biorate/errors';

/** @description Connector connection not exists error. */
export class ConnectorConnectionNotExistsError extends BaseError {
  public constructor(type: string, name: string) {
    super(`Connection not exists: [%s]:[%s]`, [type, name]);
  }
}

/** @description Connector empty connections error. */
export class ConnectorEmptyConnectionsError extends BaseError {
  public constructor(type: string) {
    super(`Connector empty connections: [%s]`, [type]);
  }
}
