import { BaseError } from '@biorate/errors';

/** @description Amqp connection error. */
export class AmqpCantConnectError extends BaseError {
  public constructor(e: Error) {
    super(`Can't connect to Amqp: [%s]`, [e.message]);
  }
}

/** @description Channel not exists error. */
export class ChannelNotExistsError extends BaseError {
  public constructor(name: string) {
    super(`Channel not exists: [%s]`, [name]);
  }
}
