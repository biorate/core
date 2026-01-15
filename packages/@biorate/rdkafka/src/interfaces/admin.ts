import { IConnectorConfig, IConnector } from '@biorate/connector';
import { GlobalConfig, IAdminClient, NewTopic } from '@confluentinc/kafka-javascript';

export type IRDKafkaAdminConfig = IConnectorConfig & {
  global: GlobalConfig;
};

export interface IRDKafkaAdminConnection {
  readonly origin: IAdminClient;
  createTopic(topic: NewTopic, timeout?: number): Promise<void>;
  deleteTopic(topic: string, timeout?: number): Promise<void>;
  createPartitions(
    topic: string,
    desiredPartitions: number,
    timeout?: number,
  ): Promise<void>;
}

export type IRDKafkaAdminConnector = IConnector<
  IRDKafkaAdminConfig,
  IRDKafkaAdminConnection
>;
