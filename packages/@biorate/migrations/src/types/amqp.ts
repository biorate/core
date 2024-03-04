import { inject, Types } from '@biorate/inversion';
import { IConfig } from '@biorate/config';
import {
  IAmqpConnector,
  IAmqpConfig,
  IAmqpConnection,
  ChannelWrapper,
  CreateChannelOpts,
} from '@biorate/amqp';
import { Migration } from './migration';
/**
 * @description Amqp migration class
 */
export class Amqp extends Migration {
  @inject(Types.Amqp) protected connector: IAmqpConnector;
  /**
   * @description Amqp process method realization
   */
  protected async process() {
    await this.forEach<IAmqpConfig, IAmqpConnection>(
      'Amqp',
      async (config, connection, paths) => {
        const channel = connection.createChannel(
          this.config.get<CreateChannelOpts>(
            `migrations.Amqp.${config.name}.amqpChannelOptions`,
            {},
          ),
        );
        await channel.waitForConnect();
        await this.forEachPath(paths, async (file, name) => {
          try {
            await (
              require(file) as (
                channel: ChannelWrapper,
                connection: IAmqpConnection,
                config: IAmqpConfig,
                globalConfig: IConfig,
              ) => Promise<void>
            )(channel, connection, config, this.config);
            this.log(config.name, name);
          } catch (e) {}
        });
      },
    );
  }
}
