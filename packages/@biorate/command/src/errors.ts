import { BaseError } from '@biorate/errors';

export class AmqpCantConnectError extends BaseError {
  public constructor(e: Error) {
    super(`Can't connect to Amqp: [%s]`, [e.message]);
  }
}

export class ChannelNotExistsError extends BaseError {
  public constructor(name: string) {
    super(`Channel not exists: [%s]`, [name]);
  }
}
