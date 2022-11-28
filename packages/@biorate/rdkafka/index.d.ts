import { Connector } from '@biorate/connector';
import {
  IRDKafkaAdminConfig,
  IRDKafkaAdminConnection,
  IRDKafkaConsumerConfig,
  IRDKafkaConsumerConnection,
  IRDKafkaConsumerStreamConfig,
  IRDKafkaConsumerStreamConnection,
  IRDKafkaHighLevelProducerConfig,
  IRDKafkaHighLevelProducerConnection,
  IRDKafkaProducerConfig,
  IRDKafkaProducerConnection,
  IRDKafkaProducerStreamConfig,
  IRDKafkaProducerStreamConnection,
} from './src';

declare module '@biorate/rdkafka' {
  export class RDKafkaAdminConnector extends Connector<
    IRDKafkaAdminConfig,
    IRDKafkaAdminConnection
  > {
    protected readonly namespace: string;
    protected connect(config: IRDKafkaAdminConfig): Promise<IRDKafkaAdminConnection>;
  }

  export class RDKafkaConsumerConnector extends Connector<
    IRDKafkaConsumerConfig,
    IRDKafkaConsumerConnection
  > {
    protected readonly namespace: string;
    protected connect(
      config: IRDKafkaConsumerConfig,
    ): Promise<IRDKafkaConsumerConnection>;
  }

  export class RDKafkaConsumerStreamConnector extends Connector<
    IRDKafkaConsumerStreamConfig,
    IRDKafkaConsumerStreamConnection
  > {
    protected readonly namespace: string;
    protected connect(
      config: IRDKafkaConsumerStreamConfig,
    ): Promise<IRDKafkaConsumerStreamConnection>;
  }

  export class RDKafkaHighLevelProducerConnector extends Connector<
    IRDKafkaHighLevelProducerConfig,
    IRDKafkaHighLevelProducerConnection
  > {
    protected readonly namespace: string;
    protected connect(
      config: IRDKafkaHighLevelProducerConfig,
    ): Promise<IRDKafkaHighLevelProducerConnection>;
  }

  export class RDKafkaProducerConnector extends Connector<
    IRDKafkaProducerConfig,
    IRDKafkaProducerConnection
  > {
    protected readonly namespace: string;
    protected connect(
      config: IRDKafkaProducerConfig,
    ): Promise<IRDKafkaProducerConnection>;
  }

  export class RDKafkaProducerStreamConnector extends Connector<
    IRDKafkaProducerStreamConfig,
    IRDKafkaProducerStreamConnection
  > {
    protected readonly namespace: string;
    protected connect(
      config: IRDKafkaProducerStreamConfig,
    ): Promise<IRDKafkaProducerStreamConnection>;
  }
}
