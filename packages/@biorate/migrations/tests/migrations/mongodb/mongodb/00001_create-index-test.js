module.exports = async (connection, config) =>
  await connection.collection('test').createIndex({ test: 1 });
