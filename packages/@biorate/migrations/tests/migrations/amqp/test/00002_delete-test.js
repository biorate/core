module.exports = async (channel, connection, config, globalConfig) => {
  await channel.deleteExchange('test-exchange');
};
