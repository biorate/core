import type { Helpers, ProjectConfig, ProjectHooks, RunnerContextConfig } from './types';

/**
 * @description Abstract base class for project configuration files
 * (`.hygen.*`, default export). Extending it turns the config into a
 * full-featured class: state lives in constructor-initialized fields, and
 * lifecycle hooks are prototype methods with a live `this` — no nested
 * `hooks: { ... }` object required.
 *
 * @example
 * ```ts
 * import { HygenConfig } from '@biorate/hygen';
 *
 * export default class Config extends HygenConfig {
 *   private count = 0;
 *   constructor() {
 *     super();
 *     this.templates = '_templates';
 *   }
 *   // helpers as a factory method (a property or getter works too)
 *   helpers() {
 *     return { fromConfig: (s: string) => `cfg:${s}` };
 *   }
 *   // hooks as prototype methods, `this` is the config instance
 *   beforeEach(ctx) {
 *     this.count += 1;
 *     ctx.logger.log(`pair #${this.count}`);
 *   }
 * }
 * ```
 * */
export abstract class HygenConfig {
  /** @description Default templates directory (resolved relative to `cwd` when relative). */
  templates: string | undefined;
  /** @description CLI flag-key normalization mode; `'keep'` preserves keys as parsed. */
  argCase: 'keep' | 'upper-underscore';
  /** @description Default local template values applied before CLI-supplied ones. */
  localsDefaults: Record<string, unknown> | undefined;
  /**
   * @description Global parameter schema (the same shape as an action's
   * `static params`): prompted once per run before the pair loop, available to
   * every pair. An action descriptor with the same name overrides the global
   * one with a warning. */
  params: import('./types/params-schema').ParamsSchema | undefined;
  /**
   * @description Extra helpers merged with the built-in ones. A subclass may
   * provide this member in any of three forms: an own property map, a getter
   * returning a map, or a factory method `(locals, config) => Helpers`
   * (invoked per render, like the factory form of `RunnerConfig.helpers`).
   * Note: an own property shadows a prototype method — use one form per class.
   * */
  helpers?:
    | Helpers
    | ((locals: Record<string, unknown>, config: RunnerContextConfig) => Helpers);

  constructor() {
    this.templates = undefined;
    this.argCase = 'keep';
    this.localsDefaults = undefined;
    this.params = undefined;
    // Assign a neutral default only when `helpers` is not provided on the
    // subclass prototype (a getter property form or a factory method) —
    // either must not be clobbered by the constructor default.
    if (hygenHelpersProvidedOnPrototype(this)) return;
    this.helpers = undefined;
  }

  /** @description Runs once before the run's pairs. No-op unless overridden. */
  beforeAll(_ctx: import('./types').HookContext): unknown {
    return undefined;
  }

  /** @description Runs before the prompt phase of every `(name, action)` pair. No-op unless overridden. */
  beforeEach(_ctx: import('./types').HookContext): unknown {
    return undefined;
  }

  /** @description Runs after the pair's execution with its operation outcomes. No-op unless overridden. */
  afterEach(
    _ctx: import('./types').HookContext,
    _results: import('./types').ActionResult[],
  ): unknown {
    return undefined;
  }

  /** @description Runs once after the run's pairs. No-op unless overridden. */
  afterAll(
    _ctx: import('./types').HookContext,
    _results: import('./types').ActionResult[],
  ): unknown {
    return undefined;
  }

  /**
   * @description Collects the project-config subset from this instance:
   * the constructor-initialized/overridden fields plus the lifecycle hook
   * methods overridden by the subclass (bound to the instance). Non-overridden
   * hooks are omitted so absent hooks keep the merge semantics of missing
   * entries. Invoked by the configuration resolver for `HygenConfig` instances.
   * */
  toRunnerConfig(): Partial<ProjectConfig> {
    const hooks: ProjectHooks = {};
    const hookNames = ['beforeAll', 'beforeEach', 'afterEach', 'afterAll'] as const;
    for (const name of hookNames) {
      const method = (this as unknown as Record<string, unknown>)[name];
      if (method !== HygenConfig.prototype[name] && typeof method === 'function') {
        hooks[name] = (method as (...args: unknown[]) => unknown).bind(this);
      }
    }
    let { helpers } = this;
    if (typeof helpers === 'function') {
      helpers = (helpers as (...args: unknown[]) => Helpers).bind(this);
    }
    return {
      ...(this.templates !== undefined ? { templates: this.templates } : {}),
      argCase: this.argCase,
      ...(this.localsDefaults !== undefined
        ? { localsDefaults: this.localsDefaults }
        : {}),
      ...(this.params !== undefined && this.params.length > 0
        ? { params: this.params }
        : {}),
      ...(helpers !== undefined ? { helpers } : {}),
      ...(Object.keys(hooks).length > 0 ? { hooks } : {}),
    };
  }
}

/**
 * @description Walks the prototype chain (below {@link HygenConfig}) looking
 * for a `helpers` member declared by the subclass — a getter (property form)
 * or a prototype method (factory form). Either must not be clobbered by the
 * neutral constructor default. */
const hygenHelpersProvidedOnPrototype = (instance: object): boolean => {
  let proto = Object.getPrototypeOf(instance);
  while (proto && proto !== HygenConfig.prototype && proto !== Object.prototype) {
    if (Object.getOwnPropertyDescriptor(proto, 'helpers')) return true;
    proto = Object.getPrototypeOf(proto);
  }
  return false;
};
