import { MinioConnector } from '@biorate/minio';
import { MemoryMinioConnector } from '../memory/minio';
import { TestProfile } from '../profiles';
import { ITestBindingRegistry } from '../types';

/** @description Binds MinIO connector for the given test profile. */
export function bindMinio(registry: ITestBindingRegistry, profile: TestProfile) {
  if (profile === 'memory') {
    registry.rebind(MinioConnector, MemoryMinioConnector);
  } else {
    registry.bind(MinioConnector, MinioConnector);
  }
}
