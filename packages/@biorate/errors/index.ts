import { format } from 'util';

export class BaseError extends Error {
  #meta = null;

  constructor(message: string, args?: any[], meta?: any) {
    super(format(message, ...args));
    this.#meta = meta;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }

  get meta() {
    return this.#meta;
  }

  get code() {
    return this.constructor.name;
  }
}
