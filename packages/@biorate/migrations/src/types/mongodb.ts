import { Migration } from './migration';
import { IMongoDBConfig, IMongoDBConnection, IMongoDBConnector } from '@biorate/mongodb';
import { inject, Types } from '@biorate/inversion';
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
            await connection
              .collection<{ _id: string }>(
                this.config.get<string>('migrations.tableName', 'migrations'),
              )
              .insertOne({ _id: name });
            await (
              require(file) as (
                connection: IMongoDBConnection,
                config: IMongoDBConfig,
              ) => Promise<void>
            )(connection, config);
            this.log(config.name, name);
          } catch (e) {}
        }),
    );
  }
}
