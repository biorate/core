import {
  RDKafkaAdminConnector,
  RDKafkaProducerConnector,
  RDKafkaConsumerConnector,
} from '@biorate/rdkafka';
import { Mockable } from '../../src';

@Mockable({})
export class MockAdminConnector extends RDKafkaAdminConnector {}
@Mockable({})
export class MockProducerConnector extends RDKafkaProducerConnector {}
@Mockable({})
export class MockConsumerConnector extends RDKafkaConsumerConnector {}

export const topic = 'unimock-rdkafka-test';
export const timeout = 3000;
