import { inject, Types } from '@biorate/inversion';
import { IConfig } from '@biorate/config';
import {
  IKafkaJSAdminConnector,
  IKafkaJSAdminConfig,
  IKafkaJSAdminConnection,
} from '@biorate/kafkajs';
import { Migration } from './migration';
/**
 * @description Kafka migration class
 */
export class Kafka extends Migration {
  @inject(Types.Kafka) protected connector: IKafkaJSAdminConnector;
  /**
   * @description Kafka process method realization
   */
  protected async process() {
    await this.forEach<IKafkaJSAdminConfig, IKafkaJSAdminConnection>(
      'KafkaJSAdmin',
      async (config, connection, paths) =>
        await this.forEachPath(paths, async (file, name) => {
          try {
            await (
              require(file) as (
                connection: IKafkaJSAdminConnection,
                config: IKafkaJSAdminConfig,
                globalConfig: IConfig,
              ) => Promise<void>
            )(connection, config, this.config);
            this.log(config.name, name);
          } catch (e) {}
        }),
    );
  }
}
