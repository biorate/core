// import { IMinioConfig, IMinioConnection } from '@biorate/minio';

module.exports = async (connection, config) => {
  await connection.removeBucket('test-migrations');
};
