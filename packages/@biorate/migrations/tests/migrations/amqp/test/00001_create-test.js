module.exports = async (channel, connection, config, globalConfig) => {
  await channel.assertExchange('test-exchange', 'topic');
};
