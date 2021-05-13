import { BaseError } from '../../';

export const message = 'test message ';
export const msg = 'hello world';
export const meta = 'test';

export class TestError extends BaseError {
  constructor(args?: any[], meta?: any) {
    super(`${message}%s`, args, meta);
  }
}
