import { OpenSearchConnector } from '@biorate/opensearch';
import { MemoryOpenSearchConnector } from '../memory/opensearch';
import { TestProfile } from '../profiles';
import { ITestBindingRegistry } from '../types';

/** @description Binds OpenSearch connector for the given test profile. */
export function bindOpenSearch(registry: ITestBindingRegistry, profile: TestProfile) {
  if (profile === 'memory') {
    registry.rebind(OpenSearchConnector, MemoryOpenSearchConnector);
  } else {
    registry.bind(OpenSearchConnector, OpenSearchConnector);
  }
}
