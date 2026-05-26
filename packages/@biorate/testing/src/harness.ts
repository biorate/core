import { Config, IConfig } from '@biorate/config';
import { Types } from '@biorate/inversion';
import { bindConnectors } from './binders';
import { ConnectorKind, getProfileConfig } from './endpoints';
import { resolveTestProfile, TestProfile } from './profiles';
import { BindingRegistry } from './registry';

/** @description Runtime contract satisfied by `Core()` roots in tests. */
export type TestRootInstance = {
  $run(): Promise<void>;
};

export type TestRootCtor = new (...args: never[]) => object;

export type TestRootFromCtor<TRootCtor extends TestRootCtor> = InstanceType<TRootCtor> &
  TestRootInstance;

export interface ITestHarnessOptions<TRootCtor extends TestRootCtor = TestRootCtor> {
  root: TRootCtor;
  profile?: TestProfile | string;
  connectors?: ConnectorKind[];
}

export interface ITestHarness<TRoot extends TestRootInstance = TestRootInstance> {
  readonly registry: BindingRegistry;
  readonly profile: TestProfile;
  readonly root: TRoot;
  run(): Promise<void>;
  dispose(): void;
}

/** @description Creates an isolated DI harness for connector component tests. */
export function createTestHarness<TRootCtor extends TestRootCtor>(
  options: ITestHarnessOptions<TRootCtor>,
): ITestHarness<TestRootFromCtor<TRootCtor>> {
  const profile = resolveTestProfile(options.profile);
  const connectors = options.connectors ?? [];
  const registry = new BindingRegistry();

  registry.bind(Types.Config, Config);
  bindConnectors(registry, profile, connectors);
  registry.bind(options.root, options.root);

  const config = registry.container.get<IConfig>(Types.Config);
  config.merge(getProfileConfig(connectors, profile));

  let rootInstance: TestRootFromCtor<TRootCtor> | undefined;

  return {
    registry,
    profile,
    get root(): TestRootFromCtor<TRootCtor> {
      if (!rootInstance) {
        rootInstance = registry.container.get(options.root);
      }
      return rootInstance as TestRootFromCtor<TRootCtor>;
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
