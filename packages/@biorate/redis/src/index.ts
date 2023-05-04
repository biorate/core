import { injectable } from '@biorate/inversion';
import { Connector } from '@biorate/connector';
import { createClient } from 'redis';
import { RedisCantConnectError } from './errors';
import { IRedisConfig, IRedisConnection } from './interfaces';

export * from './errors';
export * from './interfaces';

/**
 * @description Redis connector
 *
 * ### Features:
 * - connector manager for redis
 *
 * @example
 * ```
 * import { inject, container, Types, Core } from '@biorate/inversion';
 * import { IConfig, Config } from '@biorate/config';
 * import { RedisConnector, RedisConfig } from '@biorate/redis';
 *
 * class Root extends Core() {
 *   @inject(RedisConnector) public connector: RedisConnector;
 * }
 *
 * container.bind<IConfig>(Types.Config).to(Config).inSingletonScope();
 * container.bind<RedisConnector>(RedisConnector).toSelf().inSingletonScope();
 * container.bind<Root>(Root).toSelf().inSingletonScope();
 *
 * container.get<IConfig>(Types.Config).merge({
 *   Redis: [
 *     {
 *       name: 'connection',
 *       options: {
 *         url: 'redis://localhost:6379'
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
export class RedisConnector extends Connector<IRedisConfig, IRedisConnection> {
  /**
   * @description Private connections storage
   */
  private '#connections': Map<string, IRedisConnection>;
  /**
   * @description Private link to selected (used) connection
   */
  private '#current': IRedisConnection | undefined;
  /**
   * @description Namespace path for fetching configuration
   */
  protected readonly namespace = 'Redis';
  /**
   * @description Create connection
   */
  protected async connect(config: IRedisConfig) {
    let connection: IRedisConnection;
    try {
      connection = createClient(config.options);
      await connection.connect();
    } catch (e: unknown) {
      throw new RedisCantConnectError(<Error>e);
    }
    return connection;
  }
}
