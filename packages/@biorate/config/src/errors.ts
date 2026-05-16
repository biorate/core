import { BaseError } from '@biorate/errors';
import { PropertyPath } from 'lodash';

/**
 * @description Thrown when a config path is accessed but does not exist and no default value is provided
 * */
export class UndefinedConfigPathError extends BaseError {
  public constructor(path: PropertyPath) {
    super(`Undefined config path [%s]`, [path]);
  }
}
