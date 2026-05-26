import { MssqlConnector } from '@biorate/mssql';
import { MemoryMssqlConnector } from '../memory/mssql';
import { TestProfile } from '../profiles';
import { ITestBindingRegistry } from '../types';

/** @description Binds MSSQL connector for the given test profile. */
export function bindMssql(registry: ITestBindingRegistry, profile: TestProfile) {
  if (profile === 'memory') {
    registry.rebind(MssqlConnector, MemoryMssqlConnector);
  } else {
    registry.bind(MssqlConnector, MssqlConnector);
  }
}
