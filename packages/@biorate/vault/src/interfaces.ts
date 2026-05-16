import { IConnectorConfig, IConnector } from '@biorate/connector';
import { client, VaultOptions } from 'node-vault';

/** @description Vault client connection instance */
export type IVaultConnection = client;

/** @description Authentication configuration type for Vault approle login */
export type IAuthType = {
  type: 'approleLogin';
  responseTokenPath: 'auth.client_token';
  args: [
    {
      role_id: string;
      secret_id: string;
    },
  ];
};

/** @description Configuration interface for Vault connector */
export interface IVaultConfig extends IConnectorConfig {
  options: VaultOptions;
  auth: IAuthType;
}

/** @description Vault connector type combining config and connection */
export type IVaultConnector = IConnector<IVaultConfig, IVaultConnection>;
