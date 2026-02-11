import { IMongoDBConfig, IMongoDBConnection, IMongoDBConnector } from '@biorate/mongodb';
import { IConfig } from '@biorate/config';
import { inject, Types } from '@biorate/inversion';
import { Migration } from './migration';
/**
 * @description Mongodb migration class
 */
export class Mongodb extends Migration {
  @inject(Types.Mongodb) protected connector: IMongoDBConnector;
  /**
   * @description Mongodb process method realization
   */
  protected async process() {
    await this.forEach<IMongoDBConfig, IMongoDBConnection>(
      'MongoDB',
      async (config, connection, paths) =>
        await this.forEachPath(paths, async (file, name) => {
          try {
            await (
              require(file) as (
                connection: IMongoDBConnection,
                config: IMongoDBConfig,
                globalConfig: IConfig,
              ) => Promise<void>
            )(connection, config, this.config);
            await connection
              .collection<{ _id: string }>(
                this.config.get<string>('migrations.tableName', 'migrations'),
              )
              .insertOne({ _id: name });
            this.log(config.name, name);
          } catch (e) {}
        }),
    );
  }
}
