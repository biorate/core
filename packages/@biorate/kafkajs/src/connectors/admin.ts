import { injectable } from '@biorate/inversion';
import { Connector } from '@biorate/connector';
import { Kafka } from 'kafkajs';
import { KafkaJSAdminCantConnectError } from '../errors';
import { IKafkaJSAdminConfig, IKafkaJSAdminConnection } from '../interfaces';
import { LogCreator } from '../logger';
/**
 * @description KafkaJS admin connector
 *
 * ### Features:
 * - admin connector manager for KafkaJS
 *
 * @example
 * ```
 * ```
 */
@injectable()
export class KafkaJSAdminConnector extends Connector<
  IKafkaJSAdminConfig,
  IKafkaJSAdminConnection
> {
  /**
   * @description Namespace path for fetching configuration
   */
  protected readonly namespace = 'KafkaJSAdmin';
  /**
   * @description Create connection
   */
  protected async connect(config: IKafkaJSAdminConfig) {
    let connection: IKafkaJSAdminConnection;
    try {
      connection = await new Kafka({ logCreator: LogCreator, ...config.global }).admin(
        config.options,
      );
    } catch (e: unknown) {
      throw new KafkaJSAdminCantConnectError(<Error>e);
    }
    return connection;
  }
}
