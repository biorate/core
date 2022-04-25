import { init, injectable } from '@biorate/inversion';
import { events } from '@biorate/tools';
import { Connector } from '@biorate/connector';
import { createConnection } from 'mongoose';
import { getModelForClass } from '@typegoose/typegoose';
import { MongoDBCantConnectError } from './errors';
import { IMongoDBConfig, IMongoDBConnection, AnyParamConstructor } from './interfaces';
import { ReturnModelType } from '@typegoose/typegoose/lib/types';
import {TestModel} from "../tests/__mocks__/models";

export * from '@typegoose/typegoose';
export * as mongoose from 'mongoose';
export * as mongodb from 'mongodb';
export * from './errors';
export * from './interfaces';

/**
 * @description Mongodb connector
 *
 * ### Features:
 * - connector manager for mongodb
 *
 * @example
 * ```
 * ```
 */
@injectable()
export class MongoDBConnector extends Connector<IMongoDBConfig, IMongoDBConnection> {
  public static connections: Map<string, IMongoDBConnection>;

  protected readonly namespace = 'MongoDB';

  protected async connect(config: IMongoDBConfig) {
    let connection;
    try {
      connection = createConnection(config.host, config.options);
      await events.once(connection, 'open');
    } catch (e) {
      throw new MongoDBCantConnectError(e);
    }
    return connection;
  }

  @init() protected async initialize() {
    MongoDBConnector.connections = this.connections;
    await super.initialize();
  }
}

export const model = <T = AnyParamConstructor<unknown>>(
  Model: AnyParamConstructor<T>,
  connection?: string,
  options: Record<string, unknown> = {},
) => {
  return (proto?: any, key?: string) => {
    Object.defineProperty(proto, key, {
      get() {
        return getModelForClass(Model, {
          existingConnection: connection
            ? MongoDBConnector.connections.get(connection)
            : [...MongoDBConnector.connections][0][1],
          options,
        });
      },
      configurable: false,
    });
  };
};
