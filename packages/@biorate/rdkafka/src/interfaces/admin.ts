import { IConnectorConfig, IConnector } from '@biorate/connector';
import type {
  GlobalConfig,
  IAdminClient,
  NewTopic,
} from '@confluentinc/kafka-javascript';

/**
 * @description Configuration for the RDKafka admin client.
 */
export type IRDKafkaAdminConfig = IConnectorConfig & {
  global: GlobalConfig;
};

/**
 * @description Admin client connection interface.
 */
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

/**
 * @description Admin connector type.
 */
export type IRDKafkaAdminConnector = IConnector<
  IRDKafkaAdminConfig,
  IRDKafkaAdminConnection
>;
