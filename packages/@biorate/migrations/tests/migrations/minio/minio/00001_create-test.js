module.exports = async (connection, config) =>
  await connection.makeBucket('test-migrations', 'test-migrations');
