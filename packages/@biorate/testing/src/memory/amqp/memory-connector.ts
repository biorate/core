import { Connector } from '@biorate/connector';
import { injectable } from '@biorate/inversion';
import { ChannelWrapper } from 'amqp-connection-manager';
import { ChannelNotExistsError, IAmqpConfig, ICreateChannelOpts } from '@biorate/amqp';
import { MemoryAmqpChannelWrapper } from './memory-channel';
import { MemoryAmqpConnection } from './memory-connection';

export type IMemoryAmqpConnection = MemoryAmqpConnection;

/** @description In-memory AMQP connector for unit and component tests. */
@injectable()
export class MemoryAmqpConnector extends Connector<IAmqpConfig, IMemoryAmqpConnection> {
  protected readonly namespace = 'Amqp';
  protected readonly channels = new Map<string, MemoryAmqpChannelWrapper>();

  protected async connect() {
    return new MemoryAmqpConnection();
  }

  public createChannel(name: string, options: ICreateChannelOpts) {
    const channel = this.connection(name).createChannel(options);
    this.channels.set(options.name, channel);
    return channel as unknown as ChannelWrapper;
  }

  /** @description Returns the in-memory channel after setup has completed. */
  public async channelReady(name: string) {
    const channel = this.channels.get(name);
    if (!channel) throw new ChannelNotExistsError(name);
    await channel.waitReady();
    return channel;
  }

  public channel(name: string) {
    if (!this.channels.has(name)) throw new ChannelNotExistsError(name);
    return this.channels.get(name) as unknown as ChannelWrapper;
  }
}
