import { Connector } from '@biorate/connector';
import { IAmqpConfig, IAmqpConnection } from './src/interfaces';
import { ChannelWrapper } from 'amqp-connection-manager';

declare module '@biorate/amqp' {
  export class AmqpConnector extends Connector<IAmqpConfig, IAmqpConnection> {
    /**
     * @description Namespace path for fetching configuration
     */
    protected readonly namespace: string;
    /**
     * @description Channels storage
     */
    protected readonly channels = new Map<string, ChannelWrapper>();
    /**
     * @description Create connection
     */
    protected connect(config: IAmqpConfig): Promise<IAmqpConnection>;
    /**
     * @description Create channel method
     */
    public createChannel(name: string, options: ICreateChannelOpts): ChannelWrapper;
    /**
     * @description Get channel method
     */
    public channel(name: string): ChannelWrapper | undefined;
  }
}
