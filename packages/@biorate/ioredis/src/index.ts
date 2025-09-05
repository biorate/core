import { injectable } from '@biorate/inversion';
import { Connector } from '@biorate/connector';
import { Redis } from 'ioredis';
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
  protected readonly namespace = 'IORedis';
  /**
   * @description Create connection
   */
  protected async connect(config: IIORedisConfig) {
    const reconnectTimes = config.options?.reconnectTimes ?? 0;
    const reconnectTimeoutDelta = config.options?.reconnectTimeoutDelta ?? 100;
    const reconnectTimeoutLimit = config.options?.reconnectTimeoutLimit ?? 5000;
    let connection: IIORedisConnection;
    try {
      connection = new Redis({
        retryStrategy: (times) => {
          if (times > reconnectTimes) return null;
          return Math.min(times * reconnectTimeoutDelta, reconnectTimeoutLimit);
        },
        ...config.options,
        lazyConnect: true,
      });
      await connection.connect();
    } catch (e: unknown) {
      throw new IORedisCantConnectError(<Error>e);
    }
    return connection;
  }
}
