import { PgConnector } from '@biorate/pg';
import { MemoryPgConnector } from '../memory/pg';
import { ITestBindingRegistry } from '../types';
import { TestProfile } from '../profiles';

/** @description Binds PostgreSQL connector for the given test profile. */
export function bindPg(registry: ITestBindingRegistry, profile: TestProfile) {
  if (profile === 'memory') {
    registry.rebind(PgConnector, MemoryPgConnector);
  } else {
    registry.bind(PgConnector, PgConnector);
  }
}
