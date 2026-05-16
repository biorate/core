import { BaseError } from '@biorate/errors';

/** @description Error thrown when unable to connect to MongoDB. */
export class MongoDBCantConnectError extends BaseError {
  public constructor(e: Error) {
    super(`Can't connect to MongoDB: [%s]`, [e.message]);
  }
}

/** @description Error thrown when a requested MongoDB connection does not exist. */
export class MongoDBConnectionNotExistsError extends BaseError {
  public constructor(name?: string) {
    super(`MongoDB connection not exists: [%s]`, [name]);
  }
}
