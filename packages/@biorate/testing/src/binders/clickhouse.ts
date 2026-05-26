import { ClickhouseConnector } from '@biorate/clickhouse';
import { MemoryClickhouseConnector } from '../memory/clickhouse';
import { TestProfile } from '../profiles';
import { ITestBindingRegistry } from '../types';

/** @description Binds ClickHouse connector for the given test profile. */
export function bindClickhouse(registry: ITestBindingRegistry, profile: TestProfile) {
  if (profile === 'memory') {
    registry.rebind(ClickhouseConnector, MemoryClickhouseConnector);
  } else {
    registry.bind(ClickhouseConnector, ClickhouseConnector);
  }
}
