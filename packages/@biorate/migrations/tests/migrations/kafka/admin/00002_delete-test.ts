import { IKafkaJSAdminConfig, IKafkaJSAdminConnection } from '@biorate/kafkajs';

module.exports = async (
  connection: IKafkaJSAdminConnection,
  config: IKafkaJSAdminConfig,
) => {
  await connection.deleteTopics({
    topics: ['test'],
  });
};
