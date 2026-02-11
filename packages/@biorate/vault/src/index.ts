import { injectable } from '@biorate/inversion';
import { Connector } from '@biorate/connector';
import { client } from 'node-vault';
import Client from 'node-vault';
import { pick, get } from 'lodash';
import { VaultCantConnectError } from './errors';
import { IVaultConfig, IVaultConnection } from './interfaces';

export * from './errors';
export * from './interfaces';

/**
 * @description Vault connector
 *
 * ### Features:
 * - connector manager for vault
 *
 * @example
 * ```
 * import { inject, container, Types, Core } from '@biorate/inversion';
 * import { IConfig, Config } from '@biorate/config';
 * import { VaultConnector } from '@biorate/vault';
 *
 * export class Root extends Core() {
 *   @inject(VaultConnector) public connector: VaultConnector;
 * }
 *
 * container.bind<IConfig>(Types.Config).to(Config).inSingletonScope();
 * container.bind<VaultConnector>(VaultConnector).toSelf().inSingletonScope();
 * container.bind<Root>(Root).toSelf().inSingletonScope();
 *
 * container.get<IConfig>(Types.Config).merge({
 *   Vault: [
 *     {
 *       name: 'connection',
 *       options: {
 *         apiVersion: 'v1',
 *         endpoint: 'http://localhost:8200',
 *         token: 'admin',
 *       },
 *     },
 *   ],
 * });
 *
 * (async () => {
 *   const root = container.get<Root>(Root);
 *   await root.$run();
 *   await root.connector.current!.write('secret/data/test.json', {
 *     data: { hello: 'world' },
 *   });
 *   const result = await root.connector.current!.read('secret/data/test.json');
 *   console.log(result.data.data); // { hello: 'world' }
 * })();
 * ```
 */
@injectable()
export class VaultConnector extends Connector<IVaultConfig, IVaultConnection> {
  /**
   * @description Private connections storage
   */
  private '#connections': Map<string, IVaultConnection>;
  /**
   * @description Private link to selected (used) connection
   */
  private '#current': IVaultConnection | undefined;
  /**
   * @description Namespace path for fetching configuration
   */
  protected readonly namespace = 'Vault';
  /**
   * @description Create connection
   */
  protected async connect(config: IVaultConfig) {
    let connection: client;
    try {
      connection = Client(
        pick(config.options, 'apiVersion', 'endpoint', 'namespace', 'token'),
      );
      if (config.auth)
        connection = Client({
          token: get(
            await connection[config.auth.type](...config.auth.args),
            config.auth.responseTokenPath,
          ),
          ...config.options,
        });
    } catch (e: unknown) {
      throw new VaultCantConnectError(<Error>e);
    }
    return connection;
  }
}
