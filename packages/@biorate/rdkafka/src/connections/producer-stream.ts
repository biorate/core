import {
  Producer,
  ProducerGlobalConfig,
  ProducerTopicConfig,
  WriteStreamOptions,
  ProducerStream,
} from 'node-rdkafka';
import { IRDKafkaProducerStreamConnection } from '../interfaces';
/**
 * @description RDKafka producer stream connection
 */
export class RDKafkaProducerStreamConnection implements IRDKafkaProducerStreamConnection {
  public stream: ProducerStream;

  public constructor(
    globalConfig: ProducerGlobalConfig,
    topicConfig: ProducerTopicConfig,
    streamConfig: WriteStreamOptions,
  ) {
    this.stream = Producer.createWriteStream(globalConfig, topicConfig, streamConfig);
  }

  public write(buffer: Buffer) {
    return this.stream.write(buffer);
  }
}
