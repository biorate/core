import { BaseError } from '@biorate/errors';
import { PropertyPath } from 'lodash';

export class UndefinedConfigPathError extends BaseError {
  public constructor(path: PropertyPath) {
    super(`Undefined config path [%s]`, [path]);
  }
}
