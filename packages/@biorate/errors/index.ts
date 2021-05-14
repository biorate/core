import { format } from 'util';

export class BaseError extends Error {
  #meta: any = null;

  public constructor(message: string, args?: any[], meta?: any) {
    super(format(message, ...args));
    this.#meta = meta;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }

  public get meta() {
    return this.#meta;
  }

  public get code() {
    return this.constructor.name;
  }
}
