import {
  RDKafkaAdminConnector,
  RDKafkaConsumerConnector,
  RDKafkaConsumerStreamConnector,
  RDKafkaHighLevelProducerConnector,
  RDKafkaProducerConnector,
} from '@biorate/rdkafka';
import { TestProfile } from '../profiles';
import { ITestBindingRegistry } from '../types';

/** @description Binds RDKafka connectors (docker profile; no in-memory mock yet). */
export function bindRdkafka(registry: ITestBindingRegistry, profile: TestProfile) {
  void profile;
  registry.bind(RDKafkaAdminConnector, RDKafkaAdminConnector);
  registry.bind(RDKafkaProducerConnector, RDKafkaProducerConnector);
  registry.bind(RDKafkaHighLevelProducerConnector, RDKafkaHighLevelProducerConnector);
  registry.bind(RDKafkaConsumerConnector, RDKafkaConsumerConnector);
  registry.bind(RDKafkaConsumerStreamConnector, RDKafkaConsumerStreamConnector);
}
