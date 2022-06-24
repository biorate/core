import { BaseError } from '@biorate/errors';

export class MongoDBCantConnectError extends BaseError {
  public constructor(e: Error) {
    super(`Can't connect to MongoDB: [%s]`, [e.message]);
  }
}

export class MongoDBConnectionNotExistsError extends BaseError {
  public constructor(name?: string) {
    super(`MongoDB connection not exists: [%s]`, [name]);
  }
}
