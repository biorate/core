import { kebabCase } from 'lodash';
import { inject, Types } from '@biorate/inversion';
import {
  ISchemaRegistryConnector,
  ISchemaRegistryConfig,
  ISchemaRegistryConnection,
  ICompatibilities,
} from '@biorate/schema-registry';
import { Migration } from './migration';
import { SchemaRegistryWrongFileNameError } from '../errors';
/**
 * @description Schema registry migration class
 */
export class SchemaRegistry extends Migration {
  @inject(Types.SchemaRegistry) protected connector: ISchemaRegistryConnector;
  /**
   * @description Get migration type
   */
  protected override get type() {
    return kebabCase(this.constructor.name);
  }
  /**
   * @description Schema registry process method realization
   */
  protected async process() {
    await this.forEach<
      ISchemaRegistryConfig & { compatibility?: ICompatibilities },
      ISchemaRegistryConnection
    >(
      'SchemaRegistry',
      async (config, connection, paths) =>
        await this.forEachPath(paths, async (file, fullName) => {
          const name = fullName.split('_')?.[1]?.replace('.json', '');
          if (!name) throw new SchemaRegistryWrongFileNameError(fullName);
          const schema = <Record<string, unknown>>require(file);
          await connection.putConfig({
            subject: name,
            compatibility: config.compatibility ?? 'FORWARD',
          });
          try {
            await connection.postSubjects({
              subject: name,
              schema,
            });
          } catch {
            await connection.postSubjectsVersions({
              subject: name,
              schema,
            });
            this.log(config.name, fullName);
          }
        }),
    );
  }
}
