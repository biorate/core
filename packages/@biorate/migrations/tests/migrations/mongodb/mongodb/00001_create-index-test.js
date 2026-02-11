import { IMongoDBConfig, IMongoDBConnection } from '@biorate/mongodb';
console.log('mongo!!!!!!!!');
module.exports = async (connection: IMongoDBConnection, config: IMongoDBConfig) =>
  await connection.collection('test').createIndex({ test: 1 });
