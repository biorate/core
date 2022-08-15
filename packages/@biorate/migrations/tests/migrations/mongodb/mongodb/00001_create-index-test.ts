import { IMongoDBConfig, IMongoDBConnection } from '@biorate/mongodb';

module.exports = async (connection: IMongoDBConnection, config: IMongoDBConfig) =>
  await connection.collection('test').createIndex({ test: 1 });
