import { IAmqpConfig, IAmqpConnection, ChannelWrapper } from '@biorate/amqp';
import { IConfig } from '@biorate/config';

module.exports = async (
  channel: ChannelWrapper,
  connection: IAmqpConnection,
  config: IAmqpConfig,
  globalConfig: IConfig,
) => {
  await channel.assertExchange('test-exchange', 'topic');
};
