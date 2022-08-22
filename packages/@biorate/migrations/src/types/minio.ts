import { Migration } from './migration';
import { IMinioConnector, IMinioConfig, IMinioConnection } from '@biorate/minio';
import { inject, Types } from '@biorate/inversion';
/**
 * @description Minio migration class
 */
export class Minio extends Migration {
  @inject(Types.Minio) protected connector: IMinioConnector;
  /**
   * @description Minio process method realization
   */
  protected async process() {
    await this.forEach<IMinioConfig, IMinioConnection>(
      'Minio',
      async (config, connection, paths) =>
        await this.forEachPath(paths, async (file, name) => {
          const tableName = this.config.get<string>('migrations.tableName', 'migrations');
          try {
            await connection.makeBucket(tableName, tableName);
          } catch {}

          try {
            await connection.getObject(tableName, name);
          } catch (e) {
            await (
              require(file) as (
                connection: IMinioConnection,
                config: IMinioConfig,
              ) => Promise<void>
            )(connection, config);
            await connection.putObject(tableName, name, Buffer.from('1'));
            this.log(config.name, name);
          }
        }),
    );
  }
}
