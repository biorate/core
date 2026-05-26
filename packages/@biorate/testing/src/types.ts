/** @description Test profile for connector bindings. */
export type TestProfile = 'memory' | 'docker';

type ServiceIdentifier<T = unknown> = new (...args: never[]) => T;

/** @description Minimal registry surface used by connector test binders. */
export interface ITestBindingRegistry {
  bind<T>(service: ServiceIdentifier<T>, implementation: ServiceIdentifier<T>): void;
  rebind<T>(service: ServiceIdentifier<T>, implementation: ServiceIdentifier<T>): void;
}
