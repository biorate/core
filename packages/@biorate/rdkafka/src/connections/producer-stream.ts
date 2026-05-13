import type { ProducerStream } from '@confluentinc/kafka-javascript';
import { Producer } from '../kafka-runtime';
import {
  IRDKafkaProducerStreamConnection,
  IRDKafkaProducerStreamConfig,
} from '../interfaces';
/**
 * @description RDKafka producer stream connection
 */
export class RDKafkaProducerStreamConnection implements IRDKafkaProducerStreamConnection {
  public stream: ProducerStream;
  protected config: IRDKafkaProducerStreamConfig;

  public constructor(config: IRDKafkaProducerStreamConfig) {
    this.config = config;
    this.stream = Producer.createWriteStream(config.global, config.topic, config.stream);
  }

  public write(buffer: Buffer) {
    return this.stream.write(buffer);
  }
}
