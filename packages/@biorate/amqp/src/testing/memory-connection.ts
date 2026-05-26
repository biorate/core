import { EventEmitter } from 'events';
import { CreateChannelOpts } from 'amqp-connection-manager';
import { MemoryAmqpChannelWrapper } from './memory-channel';

/** @description In-memory AMQP connection manager. */
export class MemoryAmqpConnection extends EventEmitter {
  public constructor() {
    super();
    queueMicrotask(() => this.emit('connect'));
  }

  public createChannel(options: CreateChannelOpts) {
    return new MemoryAmqpChannelWrapper(options as import('../interfaces').ICreateChannelOpts);
  }
}
