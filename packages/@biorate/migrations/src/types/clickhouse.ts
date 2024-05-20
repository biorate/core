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
          CREATE TABLE IF NOT EXISTS {tableName:Identifier} (
            name String
          )
          ENGINE = MergeTree()
          PRIMARY KEY (name);
        `;
        await connection.command({
          query: createQuery,
          query_params: { tableName },
          clickhouse_settings: {
            wait_end_of_query: 1,
          },
        });
        await this.forEachPath(paths, async (file, name) => {
          const cursor = await connection.query({
            query: `SELECT * FROM {tableName:Identifier} WHERE name = {name:String};`,
            query_params: { name, tableName },
            format: 'JSON',
          });
          const { data } = await cursor.json<{ name: string }>();
          if (data.length) return;
          await connection.command({
            query: await fs.readFile(file, 'utf8'),
            clickhouse_settings: {
              wait_end_of_query: 1,
            },
          });
          await connection.command({
            query: `INSERT INTO {tableName:Identifier} (name) VALUES ({name:String})`,
            query_params: { name, tableName },
            clickhouse_settings: {
              wait_end_of_query: 1,
            },
          });
          this.log(config.name, name);
        });
      },
    );
  }
}
