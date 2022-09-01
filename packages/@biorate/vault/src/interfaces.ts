import { IConnectorConfig, IConnector } from '@biorate/connector';
import { client, VaultOptions } from 'node-vault';

export type IVaultConnection = client;

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

export interface IVaultConfig extends IConnectorConfig {
  options: VaultOptions;
  auth: IAuthType;
}

export type IMinioConnector = IConnector<IVaultConfig, IVaultConnection>;
