import { EventEmitter } from 'events';
import { injectable } from '@biorate/inversion';
import { Connector } from '@biorate/connector';
import { events } from '@biorate/tools';
import { connect, ChannelWrapper } from 'amqp-connection-manager';
import { AmqpCantConnectError, ChannelNotExistsError } from './errors';
import { IAmqpConfig, IAmqpConnection, ICreateChannelOpts } from './interfaces';

export { ConsumeMessage } from 'amqplib/properties';
export * from 'amqp-connection-manager';
export * from './errors';
export * from './interfaces';

/**
 * @description Amqp connector
 *
 * ### Features:
 * - connection manager for AMQP
 *
 * @example
 * ```
 * import { inject, container, Types, Core } from '@biorate/inversion';
 * import { IConfig, Config } from '@biorate/config';
 * import { AmqpConnector } from '@biorate/amqp';
 *
 * const connectionName = 'amqp';
 * const channelName = 'test';
 *
 * export class Root extends Core() {
 *   @inject(AmqpConnector) public connector: AmqpConnector;
 * }
 *
 * container.bind<IConfig>(Types.Config).to(Config).inSingletonScope();
 * container.bind<AmqpConnector>(AmqpConnector).toSelf().inSingletonScope();
 * container.bind<Root>(Root).toSelf().inSingletonScope();
 *
 * container.get<IConfig>(Types.Config).merge({
 *   Amqp: [
 *     {
 *       name: connectionName,
 *       urls: ['amqp://localhost:5672'],
 *     },
 *   ],
 * });
 *
 * const root = <Root>container.get<Root>(Root);
 *
 * (async () => {
 *   root.connector.createChannel(connectionName, {
 *     name: channelName,
 *     json: true,
 *     setup: async (channel: Channel) => {
 *       await channel.assertExchange('test-exchange', 'topic');
 *       await channel.assertQueue('test-queue', { exclusive: true, autoDelete: true });
 *       await channel.bindQueue('test-queue', 'test-exchange', '#send');
 *       await channel.consume('test-queue', (data: ConsumeMessage | null) => {
 *         console.log(data?.content?.toString?.()); // {"test": 1}
 *       });
 *     },
 *   });
 *   root.connector.channel(channelName)!.publish('test-exchange', '#send', { test: 1 });
 * })();
 * ```
 */
@injectable()
export class AmqpConnector extends Connector<IAmqpConfig, IAmqpConnection> {
  /**
   * @description Private connections storage
   */
  private '#connections': Map<string, IAmqpConnection>;
  /**
   * @description Private link to selected (used) connection
   */
  private '#current': IAmqpConnection | undefined;
  /**
   * @description Namespace path for fetching configuration
   */
  protected readonly namespace = 'Amqp';
  /**
   * @description Channels storage
   */
  protected readonly channels = new Map<string, ChannelWrapper>();
  /**
   * @description Create connection
   */
  protected async connect(config: IAmqpConfig) {
    let connection: IAmqpConnection;
    try {
      connection = connect(config.urls, config.options);
      await events.once(<EventEmitter>(<unknown>connection), 'connect');
      connection.on('disconnect', console.warn);
    } catch (e: unknown) {
      throw new AmqpCantConnectError(<Error>e);
    }
    return connection;
  }
  /**
   * @description Create channel method
   */
  public createChannel(name: string, options: ICreateChannelOpts) {
    const channel = this.connection(name).createChannel(options);
    this.channels.set(options.name, channel);
    return channel;
  }
  /**
   * @description Get channel method
   */
  public channel(name: string) {
    if (!this.channels.has(name)) throw new ChannelNotExistsError(name);
    return this.channels.get(name);
  }
}
