module.exports = async (connection, config) => {
  if (
    !(await connection.createTopics({
      topics: [{ topic: 'test', numPartitions: 1 }],
    }))
  )
    throw new Error();
};
