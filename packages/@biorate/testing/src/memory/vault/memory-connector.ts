import { Connector } from '@biorate/connector';
import { injectable } from '@biorate/inversion';
import { IVaultConfig } from '@biorate/vault';
import { MemoryVaultClient } from './memory-client';

export type IMemoryVaultConnection = MemoryVaultClient;

/** @description In-memory Vault connector for unit and component tests. */
@injectable()
export class MemoryVaultConnector extends Connector<IVaultConfig, IMemoryVaultConnection> {
  protected readonly namespace = 'Vault';

  protected async connect() {
    return new MemoryVaultClient();
  }
}
