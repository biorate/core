import { BaseError } from '../../';

export const message = 'test message ';
export const msg = 'hello world';
export const meta = 'test';

export class TestError extends BaseError {
  public constructor(args?: unknown[], meta?: unknown) {
    super(`${message}%s`, args, meta);
  }
}
