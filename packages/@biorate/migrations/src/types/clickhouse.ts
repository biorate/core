import { promises as fs } from 'fs';
import { inject, Types } from '@biorate/inversion';
import { Migration } from './migration';
import {
  IClickhouseConnector,
  IClickhouseConnection,
  IClickhouseConfig,
} from '@biorate/clickhouse';
/**
 * @description Clickhouse migration class
 */
export class Clickhouse extends Migration {
  @inject(Types.Clickhouse) protected connector: IClickhouseConnector;
  /**
   * @description Clickhouse process method realization
   */
  protected async process() {
    await this.forEach<IClickhouseConfig, IClickhouseConnection>(
      'Clickhouse',
      async (config, connection, paths) => {
        const tableName = this.config.get<string>('migrations.tableName', 'migrations');
        const createQuery = `
          CREATE TABLE IF NOT EXISTS ${tableName} (
            name String
          )
          ENGINE = MergeTree()
          PRIMARY KEY (name);
        `;
        await connection.query(createQuery).toPromise();
        await this.forEachPath(paths, async (file, name) => {
          const item = await connection
            .query(`SELECT * FROM ${tableName} WHERE name = {name:String};`, {
              params: { name },
            })
            .toPromise();
          if (item.length) return;
          await connection.query(await fs.readFile(file, 'utf8')).toPromise();
          await connection
            .query(`INSERT INTO ${tableName} (name) VALUES ({name:String})`, {
              params: { name },
            })
            .toPromise();
          this.log(config.name, name);
        });
      },
    );
  }
}
