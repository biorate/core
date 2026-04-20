module.exports = async (connection, config) => {
  await connection.removeBucket('test-migrations');
};
