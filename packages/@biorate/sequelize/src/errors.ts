import { BaseError } from '@biorate/errors';

/** @description Error thrown when connection to Sequelize fails */
export class SequelizeCantConnectError extends BaseError {
  public constructor(e: Error) {
    super(`Can't connect to Sequelize: [%s]`, [e.message]);
  }
}

/** @description Error thrown when an undefined connection name is referenced */
export class UndefinedConnectionError extends BaseError {
  public constructor(name: string | undefined) {
    super(`Undefined connection: [%s]`, [name]);
  }
}
