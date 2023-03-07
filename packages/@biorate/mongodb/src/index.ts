import { init, injectable } from '@biorate/inversion';
import { events } from '@biorate/tools';
import { Connector } from '@biorate/connector';
import { createConnection } from 'mongoose';
import { getModelForClass } from '@typegoose/typegoose';
import { MongoDBCantConnectError, MongoDBConnectionNotExistsError } from './errors';
import { IMongoDBConfig, IMongoDBConnection } from './interfaces';

export * from './errors';
export * from './interfaces';
export * from '@typegoose/typegoose';
export * from 'mongodb';

/**
 * @description Mongodb ORM connector based on mongoose and typegoose
 *
 * ### Features:
 * - connector manager for mongodb
 *
 * @example
 * ```
 * import { inject, container, Types, Core } from '@biorate/inversion';
 * import { IConfig, Config } from '@biorate/config';
 * import {
 *   Severity,
 *   modelOptions,
 *   Prop,
 *   MongoDBConnector,
 *   IMongoDBConnector,
 *   model,
 *   ReturnModelType,
 * } from '@biorate/mongodb';
 *
 * // Define models
 * @modelOptions({
 *   options: {
 *     allowMixed: Severity.ALLOW,
 *   },
 *   schemaOptions: { collection: 'test', versionKey: false },
 * })
 * export class TestModel {
 *   @Prop()
 *   firstName: string;
 *
 *   @Prop()
 *   lastName: string;
 *
 *   @Prop()
 *   age: number;
 * }
 *
 * // Define root
 * export class Root extends Core() {
 *   @inject(MongoDBConnector) public connector: IMongoDBConnector;
 *   @model(TestModel) public test: ReturnModelType<typeof TestModel>;
 * }
 *
 * // Bind dependencies
 * container.bind<IConfig>(Types.Config).to(Config).inSingletonScope();
 * container.bind<IMongoDBConnector>(MongoDBConnector).toSelf().inSingletonScope();
 * container.bind<Root>(Root).toSelf().inSingletonScope();
 *
 * // Configure
 * container.get<IConfig>(Types.Config).merge({
 *   MongoDB: [
 *     {
 *       name: 'connection',
 *       host: 'mongodb://localhost:27017/',
 *       options: {
 *         useNewUrlParser: true,
 *         useUnifiedTopology: true,
 *         dbName: 'test',
 *       },
 *     },
 *   ],
 * });
 *
 * (async () => {
 *   const root = container.get<Root>(Root);
 *   await root.$run();
 *   await root.connector.connection().dropDatabase();
 *
 *   const connection = root.connector.connection('connection'); // Get connection instance
 *   console.log(connection);
 *
 *   await new root.test({
 *     firstName: 'Vasya',
 *     lastName: 'Pupkin',
 *     age: 36,
 *   }).save(); // insert data into test collection
 *
 *   // Get data from database
 *   const data = await root.test.find({ firstName: 'Vasya' }, { _id: 0 });
 *   console.log(data); // {
 *                      //   firstName: 'Vasya',
 *                      //   lastName: 'Pupkin',
 *                      //   age: 36,
 *                      // }
 * })();
 * ```
 */
@injectable()
export class MongoDBConnector extends Connector<IMongoDBConfig, IMongoDBConnection> {
  /**
   * @description Namespace path for fetching configuration
   */
  protected readonly namespace = 'MongoDB';
  /**
   * @description Create connection
   */
  protected async connect(config: IMongoDBConfig) {
    let connection: IMongoDBConnection;
    try {
      connection = createConnection(config.host, config.options);
      await events.once(connection, 'open');
    } catch (e: unknown) {
      throw new MongoDBCantConnectError(<Error>e);
    }
    return connection;
  }
  /**
   * @description Initialize method
   */
  @init() protected async initialize() {
    connections = this.connections;
    await super.initialize();
  }
}
/**
 * @description Private connections link
 */
let connections: Map<string, IMongoDBConnection> | null = null;
/**
 * @description Model injection decorator
 */
export const model = <T = unknown>(
  Model: new (...args: any) => T,
  connection?: string,
  options: Record<string, unknown> = {},
) => {
  return (proto: any, key: string) => {
    Object.defineProperty(proto, key, {
      get() {
        const existingConnection = connection
          ? connections?.get(connection)
          : connections
          ? [...connections][0][1]
          : null;
        if (!existingConnection) throw new MongoDBConnectionNotExistsError(connection);
        return getModelForClass(Model, {
          existingConnection,
          options,
        });
      },
      configurable: false,
    });
  };
};
