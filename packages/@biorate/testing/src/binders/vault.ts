import { VaultConnector } from '@biorate/vault';
import { MemoryVaultConnector } from '../memory/vault';
import { TestProfile } from '../profiles';
import { ITestBindingRegistry } from '../types';

/** @description Binds Vault connector for the given test profile. */
export function bindVault(registry: ITestBindingRegistry, profile: TestProfile) {
  if (profile === 'memory') {
    registry.rebind(VaultConnector, MemoryVaultConnector);
  } else {
    registry.bind(VaultConnector, VaultConnector);
  }
}
