import { MongoDBConnector } from '@biorate/mongodb';
import { TestProfile } from '../profiles';
import { ITestBindingRegistry } from '../types';

/** @description Binds MongoDB connector (docker profile; no in-memory mock yet). */
export function bindMongoDB(registry: ITestBindingRegistry, profile: TestProfile) {
  void profile;
  registry.bind(MongoDBConnector, MongoDBConnector);
}
