import { PgConnector } from '../index';
import { MemoryPgConnector } from './memory-connector';

export type PgTestProfile = 'memory' | 'docker';

export interface IPgTestBindingRegistry {
  bind(service: unknown, implementation: unknown): void;
  rebind(service: unknown, implementation: unknown): void;
}

/** @description Binds PostgreSQL connector for the given test profile. */
export function bindPg(registry: IPgTestBindingRegistry, profile: PgTestProfile) {
  if (profile === 'memory') {
    registry.rebind(PgConnector, MemoryPgConnector);
  } else {
    registry.bind(PgConnector, PgConnector);
  }
}
