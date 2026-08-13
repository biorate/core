import { injectable } from '@biorate/inversion';
import { Connector } from '@biorate/connector';
import { Redis } from 'ioredis';
import { gracefulDegradation } from './graceful';
import { IORedisCantConnectError } from './errors';
import { IIORedisConfig, IIORedisConnection } from './interfaces';

export * from './errors';
export * from './interfaces';
/**
 * @description IORedis connector
 *
 * ### Features:
 * - connector manager for redis
 *
 * @example
 * ```
 * import { inject, container, Types, Core } from '@biorate/inversion';
 * import { IConfig, Config } from '@biorate/config';
 * import { IORedisConnector, IORedisConfig } from '@biorate/ioredis';
 *
 * class Root extends Core() {
 *   @inject(IORedisConnector) public connector: IORedisConnector;
 * }
 *
 * container.bind<IConfig>(Types.Config).to(Config).inSingletonScope();
 * container.bind<IORedisConnector>(IORedisConnector).toSelf().inSingletonScope();
 * container.bind<Root>(Root).toSelf().inSingletonScope();
 *
 * container.get<IConfig>(Types.Config).merge({
 *   IORedis: [
 *     {
 *       name: 'connection',
 *       options: {
 *         host: 'localhost',
 *         port: 6379,
 *       },
 *     },
 *   ],
 * });
 *
 * (async () => {
 *   const root = container.get<Root>(Root);
 *   await root.$run();
 *
 *   await root.connector.current!.set('key', 'value');
 *   console.log(await root.connector.current!.get('key')); // value
 * })();
 * ```
 */
@injectable()
export class IORedisConnector extends Connector<IIORedisConfig, IIORedisConnection> {
  /**
   * @description Private connections storage
   */
  private '#connections': Map<string, IIORedisConnection>;
  /**
   * @description Private link to selected (used) connection
   */
  private '#current': IIORedisConnection | undefined;
  /**
   * @description Namespace path for fetching configuration
   */
  protected readonly namespace: string = 'IORedis';
  /**
   * @description Create connection
   */
  protected async connect(config: IIORedisConfig) {
    let connection: IIORedisConnection;
    try {
      const reconnectTimes = config.options?.reconnectTimes ?? -1;
      const reconnectTimeoutDelta = config.options?.reconnectTimeoutDelta ?? 30_000;
      const reconnectTimeoutLimit = config.options?.reconnectTimeoutLimit ?? 30_000;
      connection = new Redis({
        retryStrategy: (times) => {
          if (times > reconnectTimes && reconnectTimes !== -1) return null;
          return Math.min(times * reconnectTimeoutDelta, reconnectTimeoutLimit);
        },
        failoverDetector: true,
        lazyConnect: true,
        maxRetriesPerRequest: 0,
        ...config.options,
      });
      if (config.options.lazyConnect === false) await connection.connect();
      if (config.options?.gracefulDegradation !== false) gracefulDegradation(connection);
    } catch (e: unknown) {
      throw new IORedisCantConnectError(<Error>e);
    }
    return connection;
  }
}
