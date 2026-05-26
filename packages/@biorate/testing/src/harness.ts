import { Config, IConfig } from '@biorate/config';
import { Types } from '@biorate/inversion';
import { ConnectorBinder, resolveBinders } from './binders';
import { ConnectorKind, getProfileConfig } from './endpoints';
import { resolveTestProfile, TestProfile } from './profiles';
import { BindingRegistry } from './registry';

export interface ITestHarnessOptions<TRoot extends { $run(): Promise<void> }> {
  root: new (...args: never[]) => TRoot;
  profile?: TestProfile | string;
  connectors?: ConnectorKind[];
  /** Binder functions from `@biorate/<connector>/testing` (e.g. `bindPg`). */
  binders?: ConnectorBinder[];
}

export interface ITestHarness<TRoot extends { $run(): Promise<void> }> {
  readonly registry: BindingRegistry;
  readonly profile: TestProfile;
  readonly root: TRoot;
  run(): Promise<void>;
  dispose(): void;
}

/** @description Creates an isolated DI harness for connector component tests. */
export function createTestHarness<TRoot extends { $run(): Promise<void> }>(
  options: ITestHarnessOptions<TRoot>,
): ITestHarness<TRoot> {
  const profile = resolveTestProfile(options.profile);
  const connectors = options.connectors ?? [];
  const binders = resolveBinders(connectors, options.binders ?? []);
  const registry = new BindingRegistry();

  registry.bind(Types.Config, Config);
  for (const bind of binders) bind(registry, profile);
  registry.bind(options.root, options.root);

  const config = registry.container.get<IConfig>(Types.Config);
  config.merge(getProfileConfig(connectors, profile));

  let rootInstance: TRoot | undefined;

  return {
    registry,
    profile,
    get root(): TRoot {
      if (!rootInstance) {
        rootInstance = registry.container.get(options.root);
      }
      return rootInstance as TRoot;
    },
    async run() {
      await this.root.$run();
    },
    dispose() {
      rootInstance = undefined;
      registry.dispose();
    },
  };
}
