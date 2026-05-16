import { IConnectorConfig, IConnector } from '@biorate/connector';
import type {
  ProducerGlobalConfig,
  ProducerTopicConfig,
  WriteStreamOptions,
} from '@confluentinc/kafka-javascript';

/**
 * @description Configuration for the RDKafka producer stream.
 */
export type IRDKafkaProducerStreamConfig = IConnectorConfig & {
  global: ProducerGlobalConfig;
  topic: ProducerTopicConfig;
  stream: WriteStreamOptions;
};

/**
 * @description Producer stream connection interface.
 */
export interface IRDKafkaProducerStreamConnection {}

/**
 * @description Producer stream connector type.
 */
export type IRDKafkaProducerStreamConnector = IConnector<
  IRDKafkaProducerStreamConfig,
  IRDKafkaProducerStreamConnection
>;
