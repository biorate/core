import { BaseError } from '@biorate/errors';

export class SequelizeCantConnectError extends BaseError {
  public constructor(e: Error) {
    super(`Can't connect to Sequelize: [%s]`, [e.message]);
  }
}

export class UndefinedConnectionError extends BaseError {
  public constructor(name: string | undefined) {
    super(`Undefined connection: [%s]`, [name]);
  }
}
