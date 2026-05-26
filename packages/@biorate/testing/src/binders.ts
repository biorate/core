import { ITestBindingRegistry } from './types';
import { ConnectorKind } from './endpoints';
import { TestProfile } from './profiles';

/** @description Registers a connector implementation for a test profile. */
export type ConnectorBinder = (
  registry: ITestBindingRegistry,
  profile: TestProfile,
) => void;

/** @description Resolves binder functions for the requested connector kinds. */
export function resolveBinders(
  connectors: ConnectorKind[],
  binders: ConnectorBinder[],
): ConnectorBinder[] {
  if (binders.length > 0) return binders;
  if (connectors.length > 0) {
    throw new Error(
      `createTestHarness: pass binders from @biorate/<connector>/testing (e.g. bindPg from @biorate/pg/testing)`,
    );
  }
  return [];
}
