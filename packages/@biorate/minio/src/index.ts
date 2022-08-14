import { init, injectable } from '@biorate/inversion';
import { Connector } from '@biorate/connector';
import { Client } from 'minio';
import { MinioCantConnectError } from './errors';
import { MinioConnection, MinioConfig } from './interfaces';

export * from './errors';
export * from './interfaces';

/**
 * @description Minio connector
 *
 * ### Features:
 * - connector manager for minio
 *
 * @example
 * ```
 * import { inject, container, Types, Core } from '@biorate/inversion';
 * import { IConfig, Config } from '@biorate/config';
 * import { MinioConnector, MinioConfig } from '@biorate/minio';
 *
 * class Root extends Core() {
 *   @inject(MinioConnector) public connector: MinioConnector;
 * }
 *
 * container.bind<IConfig>(Types.Config).to(Config).inSingletonScope();
 * container.bind<MinioConnector>(MinioConnector).toSelf().inSingletonScope();
 * container.bind<Root>(Root).toSelf().inSingletonScope();
 *
 * container.get<IConfig>(Types.Config).merge({
 *   Minio: [
 *     {
 *       name: 'connection',
 *       options: {
 *         endPoint: 'localhost',
 *         port: 9000,
 *         accessKey: 'admin',
 *         secretKey: 'minioadmin',
 *         useSSL: false,
 *       },
 *     },
 *   ],
 * });
 *
 * (async () => {
 *   root = container.get<Root>(Root);
 *   await root.$run();
 *   await root.connector!.current!.makeBucket('test', 'test');
 *   await root.connector!.current!.putObject(
 *     'test',
 *     'hello.world',
 *     Buffer.from('Hello world!'),
 *   ));
 *   root.connector!.current!.getObject('test', 'test.file', (e, stream) => {
 *     let data = '';
 *     stream
 *       .on('data', (chunk) => (data += chunk.length))
 *       .on('end', () => console.log(data)); // 'Hello world!'
 *    });
 * })();
 * ```
 */
@injectable()
export class MinioConnector extends Connector<MinioConfig, MinioConnection> {
  /**
   * @description Namespace path for fetching configuration
   */
  protected readonly namespace = 'Minio';
  /**
   * @description Create connection
   */
  protected async connect(config: MinioConfig) {
    let connection: Client;
    try {
      connection = new Client(config.options);
      await connection.listBuckets();
    } catch (e: unknown) {
      throw new MinioCantConnectError(<Error>e);
    }
    return connection;
  }
}
