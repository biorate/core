import { IMinioConfig, IMinioConnection } from '@biorate/minio';

module.exports = async (connection: IMinioConnection, config: IMinioConfig) => {
  await connection.removeBucket('test-migrations');
};
