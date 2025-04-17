import { compact } from 'lodash';
import { BaseError } from '@biorate/errors';

export class CommandExecutionError extends BaseError {
  public constructor(command: string, e: Error) {
    super(`Command execution error [%s]: %s`, [command, compact(e.message.split(/\n/g))]);
  }
}
