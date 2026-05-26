import { SequelizeConnector } from '@biorate/sequelize';
import { TestProfile } from '../profiles';
import { ITestBindingRegistry } from '../types';

/** @description Binds Sequelize connector (memory profile uses sqlite via config). */
export function bindSequelize(registry: ITestBindingRegistry, profile: TestProfile) {
  void profile;
  registry.bind(SequelizeConnector, SequelizeConnector);
}
