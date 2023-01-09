import { IKafkaJSAdminConfig, IKafkaJSAdminConnection } from '@biorate/kafkajs';

module.exports = async (
  connection: IKafkaJSAdminConnection,
  config: IKafkaJSAdminConfig,
) => {
  if (
    !(await connection.createTopics({
      topics: [{ topic: 'test', numPartitions: 1 }],
    }))
  )
    throw new Error();
};
