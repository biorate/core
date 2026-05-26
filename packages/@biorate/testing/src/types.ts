/** @description Test profile for connector bindings. */
export type TestProfile = 'memory' | 'docker';

/** @description Minimal registry surface used by connector test binders. */
export interface ITestBindingRegistry {
  bind(service: unknown, implementation: unknown): void;
  rebind(service: unknown, implementation: unknown): void;
}
