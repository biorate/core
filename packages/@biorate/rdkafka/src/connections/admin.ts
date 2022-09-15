import { promisify } from 'util';
import { GlobalConfig, AdminClient, IAdminClient, NewTopic } from 'node-rdkafka';
import { IRDKafkaAdminConnection } from '../interfaces';
/**
 * @description RDKafka admin client connection
 */
export class RDKafkaAdminConnection implements IRDKafkaAdminConnection {
  public readonly origin: IAdminClient;
  #createTopic: (topic: NewTopic, timeout?: number) => Promise<void>;
  #deleteTopic: (topic: string, timeout?: number) => Promise<void>;
  #createPartitions: (
    topic: string,
    desiredPartitions: number,
    timeout?: number,
  ) => Promise<void>;

  public constructor(globalConfig: GlobalConfig) {
    this.origin = AdminClient.create(globalConfig);
    this.#createTopic = promisify(this.origin.createTopic.bind(this.origin));
    this.#deleteTopic = promisify(this.origin.deleteTopic.bind(this.origin));
    this.#createPartitions = promisify(this.origin.createPartitions.bind(this.origin));
  }

  public createTopic(topic: NewTopic, timeout?: number) {
    return this.#createTopic(topic, timeout);
  }

  public deleteTopic(topic: string, timeout?: number) {
    return this.#deleteTopic(topic, timeout);
  }

  public createPartitions(topic: string, desiredPartitions: number, timeout?: number) {
    return this.#createPartitions(topic, desiredPartitions, timeout);
  }
}
