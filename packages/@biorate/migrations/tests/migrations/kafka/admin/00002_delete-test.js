module.exports = async (connection, config) => {
  await connection.deleteTopics({
    topics: ['test'],
  });
};
