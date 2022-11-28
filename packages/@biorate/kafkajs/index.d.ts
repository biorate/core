import { Connector } from '@biorate/connector';
import { Kafka, Partitioners } from 'kafkajs';
import {
  IKafkaJSAdminConfig,
  IKafkaJSAdminConnection,
  IKafkaJSConsumerConfig,
  IKafkaJSConsumerConnection,
  IKafkaJSProducerConfig,
  IKafkaJSProducerConnection,
  KafkaJSProducerCantConnectError,
} from './src';

declare module '@biorate/kafkajs' {
  export class KafkaJSAdminConnector extends Connector<
    IKafkaJSAdminConfig,
    IKafkaJSAdminConnection
  > {
    protected readonly namespace: string;
    protected connect(config: IKafkaJSAdminConfig): Promise<IKafkaJSAdminConnection>;
  }

  export class KafkaJSConsumerConnector extends Connector<
    IKafkaJSConsumerConfig,
    IKafkaJSConsumerConnection
  > {
    protected readonly namespace: string;
    protected connect(
      config: IKafkaJSConsumerConfig,
    ): Promise<IKafkaJSConsumerConnection>;
  }

  export class KafkaJSProducerConnector extends Connector<
    IKafkaJSProducerConfig,
    IKafkaJSProducerConnection
  > {
    protected readonly namespace: string;
    protected connect(
      config: IKafkaJSProducerConfig,
    ): Promise<IKafkaJSProducerConnection>;
  }
}
