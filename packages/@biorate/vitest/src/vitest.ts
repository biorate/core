import { object as o } from '@biorate/tools';
import * as allure from 'allure-js-commons';
import type { TestContext } from 'vitest';
import {
  Test,
  Skip,
  Only,
  Todo,
  Suite,
  Allure,
  Timeout,
  Repeats,
  Extends,
} from './symbols';
import { TestArgs, SuiteOptions, AllureMethod } from './interfaces';
import {
  VitestBothSkipOnlyError,
  VitestTimeoutInvalidError,
  VitestRepeatsInvalidError,
} from './errors';

export * as allure from 'allure-js-commons';

const { it, describe, beforeEach, afterEach, beforeAll, afterAll } = globalThis as any;

/**
 * Track which deprecation warnings have been shown
 */
const shownDeprecationWarnings = new Set<string>();

/**
 * Show deprecation warning once per decorator type
 */
const showDeprecationWarning = (decorator: string, recommendation: string) => {
  if (!shownDeprecationWarnings.has(decorator)) {
    shownDeprecationWarnings.add(decorator);
    console.warn(
      `[@biorate/vitest] Deprecated decorator: @${decorator}. ${recommendation}`,
    );
  }
};

/**
 * Metadata for a test method
 */
interface TestMetadata {
  name?: string;
}

/**
 * Allure metadata storage type
 */
type AllureMetadata = Record<string, any[] | any[][]>;

/**
 * Main Vitest OOP decorator class
 * Provides class-based test definition with Allure integration
 * OOP test decorators for Vitest with Allure support
 *
 * @remarks
 * Features:
 * - Class-based test definition with decorators
 * - Full Allure reporting integration
 * - Scenario pattern for reusable test steps
 * - Test lifecycle hooks (beforeAll, afterAll, before, after)
 * - Test modifiers (skip, only, todo, timeout, repeats)
 * - Suite options (mode, timeout, retries)
 * - TypeScript support with full type safety
 *
 * @example
 * ```typescript
 * import { suite, test, epic, severity, owner, tags } from '@biorate/vitest';
 * import { Severity } from 'allure-js-commons';
 * import 'reflect-metadata';
 *
 * @suite('Authentication')
 * class AuthTest {
 *   @epic('Security')
 *   @feature('Login')
 *   @story('User Authentication')
 *   @severity(Severity.CRITICAL)
 *   @owner('user-id-123')
 *   @tags('auth', 'login', 'critical')
 *   @test('should authenticate user')
 *   async shouldAuthenticate() {
 *     // test implementation
 *   }
 * }
 * ```
 *
 * @example
 * ```typescript
 * import { suite, test, skip, only, todo, timeout, repeats } from '@biorate/vitest';
 *
 * @suite('Edge Cases')
 * class EdgeCasesTest {
 *   @skip()
 *   @test('skip this test')
 *   async skippedTest() {
 *     // will be skipped
 *   }
 *
 *   @only()
 *   @test('run only this test')
 *   async exclusiveTest() {
 *     // only this test will run
 *   }
 *
 *   @todo()
 *   @test('todo test')
 *   async todoTest() {
 *     // marked as todo
 *   }
 *
 *   @timeout(5000)
 *   @test('test with timeout')
 *   async timeoutTest() {
 *     // will timeout after 5 seconds
 *   }
 *
 *   @repeats(3, { mode: 'series' })
 *   @test('flaky test')
 *   async flakyTest() {
 *     // will run 3 times in series
 *   }
 * }
 * ```
 *
 * @example
 * ```typescript
 * import { Scenario, Step, Context } from '@biorate/vitest';
 *
 * export class LoginScenario extends Scenario {
 *   @Step('Open login page')
 *   protected async openPage() {
 *     await this.context.page.goto('/login');
 *   }
 *
 *   @Step('Enter credentials')
 *   protected async enterCredentials() {
 *     await this.context.page.fill('#username', 'user');
 *     await this.context.page.fill('#password', 'pass');
 *   }
 * }
 *
 * @suite('Login Flow')
 * class LoginTest {
 *   @test('should login successfully')
 *   async testLogin() {
 *     await Context.run([LoginScenario], { page: this.page });
 *   }
 * }
 * ```
 *
 * @example
 * ```typescript
 * import { suite, test } from '@biorate/vitest';
 *
 * @suite('Database Tests')
 * class DatabaseTest {
 *   protected static async beforeAll() {
 *     // Setup before all tests
 *   }
 *
 *   protected static async afterAll() {
 *     // Cleanup after all tests
 *   }
 *
 *   protected async before() {
 *     // Setup before each test
 *   }
 *
 *   protected async after() {
 *     // Cleanup after each test
 *   }
 *
 *   @test('should connect')
 *   async shouldConnect() {
 *     // test implementation
 *   }
 * }
 * ```
 */
export class Vitest {
  /**
   * Suite decorator factory
   * @param name - Suite name (optional, defaults to class name)
   * @param options - Suite options (timeout, retries, mode)
   * @returns Class decorator
   * @example
   * ```typescript
   * @suite('My Test Suite')
   * class MyTest {}
   * ```
   * @example
   * ```typescript
   * @suite('Parallel Suite', { mode: 'parallel', timeout: 10000, retries: 2 })
   * class ParallelTest {}
   * ```
   */
  public readonly suite;

  /**
   * Test decorator factory
   * @example @test('should work')
   */
  public readonly test;

  /**
   * Skip decorator factory
   * @example @skip()
   */
  public readonly skip;

  /**
   * Only decorator factory
   * @example @only()
   */
  public readonly only;

  /**
   * Todo decorator factory
   * @example @todo()
   */
  public readonly todo;

  /**
   * Timeout decorator factory
   * @example @timeout(5000)
   */
  public readonly timeout;

  /**
   * Repeats decorator factory
   * @example @repeats(3)
   */
  public readonly repeats;

  /**
   * @deprecated Use `repeats` instead. This decorator is for Mocha compatibility.
   * Retries decorator factory for Mocha migration
   * @example @retries(3)
   */
  public readonly retries;

  /**
   * @deprecated Use `suite` with `{ mode: 'parallel' }` instead. This decorator is for Mocha compatibility.
   * Parallel decorator factory for Mocha migration
   * @example @parallel(true)
   */
  public readonly parallel;

  /**
   * @deprecated Use `timeout` instead. This decorator is for Mocha compatibility.
   * Slow decorator factory for Mocha migration
   * @example @slow(1000)
   */
  public readonly slow;

  /**
   * @deprecated Use `skip` instead. This decorator is for Mocha compatibility.
   * Pending decorator factory for Mocha migration
   * @example @pending()
   */
  public readonly pending;

  /**
   * @deprecated Use `params` from test context instead. This decorator is for Mocha compatibility.
   * Params decorator factory for Mocha migration
   * @example @params([1, 2], [3, 4])
   */
  public readonly params;

  /**
   * @deprecated Context symbol for Mocha compatibility. Use Vitest's test context directly.
   * Context symbol for Mocha migration
   */
  public readonly context;

  // Allure decorators
  public readonly label;
  public readonly link;
  public readonly id;
  public readonly epic;
  public readonly feature;
  public readonly story;
  public readonly allureSuite;
  public readonly parentSuite;
  public readonly subSuite;
  public readonly owner;
  public readonly severity;
  public readonly tag;
  public readonly tags;
  public readonly issue;
  public readonly description;

  /**
   * @deprecated Use Allure step API directly. This is for Mocha compatibility.
   * Step decorator for Mocha migration
   */
  public readonly allureStep;

  /**
   * @deprecated Use Allure attachment API directly. This is for Mocha compatibility.
   * Attachment decorator for Mocha migration
   */
  public readonly attachment;

  /**
   * @deprecated Use `id` instead. This is for Mocha compatibility.
   * TestCaseId decorator for Mocha migration
   */
  public readonly testCaseId;

  /**
   * @deprecated Data decorator for Mocha compatibility (parameterized tests)
   * Use Vitest's native parameterized tests instead.
   */
  public readonly data;

  /**
   * Initialize all decorator factories
   */
  public constructor() {
    this.suite = this.#suite;
    this.test = this.#test;
    this.skip = this.#skip;
    this.only = this.#only;
    this.todo = this.#todo;
    this.timeout = this.#timeout;
    this.repeats = this.#repeats;
    this.retries = this.#retries;
    this.parallel = this.#parallel;
    this.slow = this.#slow;
    this.pending = this.#pending;
    this.params = this.#params;
    this.context = Symbol.for('mocha.context');
    this.allureStep = this.#allureStep;
    this.attachment = this.#attachment;
    this.testCaseId = this.#testCaseId;
    this.data = this.#data;

    // Allure decorators using factory pattern
    this.label = this.#createAllureDecorator('label', true);
    this.link = this.#createLinkDecorator();
    this.id = this.#createAllureDecorator('id');
    this.epic = this.#createAllureDecorator('epic');
    this.feature = this.#createAllureDecorator('feature');
    this.story = this.#createAllureDecorator('story');
    this.allureSuite = this.#createAllureDecorator('suite');
    this.parentSuite = this.#createAllureDecorator('parentSuite');
    this.subSuite = this.#createAllureDecorator('subSuite');
    this.owner = this.#createAllureDecorator('owner');
    this.severity = this.#createAllureDecorator('severity');
    this.tag = this.#createAllureDecorator('tag');
    this.tags = this.#createAllureDecorator('tags');
    this.issue = this.#createIssueDecorator();
    this.description = this.#createAllureDecorator('description');
  }

  /**
   * Walk through class prototype and register test methods
   * @param instance - Class instance to walk
   */
  #walkProto(instance: any): void {
    const methods = new Set<string>();
    this.#registerBeforeHook(instance);
    this.#registerAfterHook(instance);

    o.walkProto(instance, (object: Record<string, any>) => {
      const names = Object.getOwnPropertyNames(object);
      for (const name of names) {
        if (methods.has(name)) continue;
        methods.add(name);

        const descriptor = Object.getOwnPropertyDescriptor(object, name);
        if (typeof descriptor?.value !== 'function') continue;
        let meta: any;
        try {
          meta = Reflect.getMetadata(Test, descriptor.value);
        } catch {
          continue;
        }
        if (!meta) continue;

        this.#registerTestMethod(instance, name, descriptor!.value, meta);
      }
    });
  }

  /**
   * Register a single test method with Vitest
   * @param instance - Class instance
   * @param name - Method name
   * @param method - Method function
   * @param meta - Test metadata
   */
  #registerTestMethod(
    instance: any,
    name: string,
    method: (...args: any[]) => Promise<void> | void,
    meta: TestMetadata,
  ): void {
    const safeGetMetadata = (key: any, target: any) => {
      try {
        return Reflect.getMetadata(key, target);
      } catch {
        return undefined;
      }
    };

    const allureMethods = safeGetMetadata(Allure, method);
    const skip = safeGetMetadata(Skip, method);
    const only = safeGetMetadata(Only, method);
    const todo = safeGetMetadata(Todo, method);
    const timeout = safeGetMetadata(Timeout, method);
    const repeats = safeGetMetadata(Repeats, method);
    const extend = safeGetMetadata(Extends, method);

    if (skip && only) {
      throw new VitestBothSkipOnlyError('test');
    }

    let testFn: any = it;
    if (skip) testFn = it.skip;
    else if (only) testFn = it.only;
    else if (todo) testFn = it.todo;

    const testOptions: any = {};
    if (timeout) testOptions.timeout = timeout[0];
    if (repeats) {
      testOptions.repeats = repeats[0];
      if (repeats[1]?.mode) testOptions.mode = repeats[1].mode;
    }

    const testFunction = async (context: TestContext & Record<string, any>) => {
      try {
        await this.#applyAllureMetadata(allureMethods);
        await method.call(instance, {
          ...context,
          ...extend,
        });
      } catch (error) {
        // Enhance error with test information
        if (error instanceof Error) {
          error.message = `Test "${meta.name ?? name}" failed: ${error.message}`;
        }
        throw error;
      }
    };

    if (Object.keys(testOptions).length > 0) {
      testFn(meta.name ?? name, testOptions, testFunction);
    } else {
      testFn(meta.name ?? name, testFunction);
    }
  }

  /**
   * Apply Allure metadata to the current test
   * @param allureMethods - Allure methods and their arguments
   */
  async #applyAllureMetadata(allureMethods: AllureMetadata): Promise<void> {
    if (!allureMethods) return;

    for (const [methodName, params] of Object.entries(allureMethods)) {
      const allureFn = (allure as any)[methodName];
      if (!allureFn) continue;

      const paramSets = Array.isArray(params[0]) ? params : [params];
      for (const paramSet of paramSets) {
        await allureFn(...paramSet);
      }
    }
  }

  /**
   * Create an Allure decorator factory
   * @param methodName - Allure method name
   * @param append - Whether to append multiple values
   */
  #createAllureDecorator(methodName: string, append = false) {
    return (...args: string[]) =>
      (target: any, propertyKey: string, descriptor: PropertyDescriptor) =>
        this.#setAllureMethod(target, methodName, args, append);
  }

  /**
   * Create a link decorator with optional type parameter
   */
  #createLinkDecorator() {
    return (url: string, name?: string, type?: string) =>
      (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
        const args: string[] = [url];
        if (name) args.push(name);
        if (type) args.push(type);
        this.#setAllureMethod(target, 'link', args);
      };
  }

  /**
   * Create an issue decorator with optional URL
   */
  #createIssueDecorator() {
    return (name: string, url?: string) =>
      (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
        const args: string[] = [name];
        if (url) args.push(url);
        this.#setAllureMethod(target, 'issue', args);
      };
  }

  /**
   * Suite decorator factory
   * @param name - Suite name (optional, defaults to class name)
   * @param options - Suite options (timeout, retries, mode)
   */
  #suite = (name?: string, options?: SuiteOptions) => (Class: new () => any) => {
    const safeGetMetadata = (key: any, target: any) => {
      try {
        return Reflect.getMetadata(key, target);
      } catch {
        return undefined;
      }
    };

    const skip = safeGetMetadata(Skip, Class);
    const only = safeGetMetadata(Only, Class);
    const suiteOptions = safeGetMetadata(Suite, Class);

    if (skip && only) {
      throw new VitestBothSkipOnlyError('suite');
    }

    const mode = suiteOptions?.mode || options?.mode;
    const timeout = suiteOptions?.timeout || options?.timeout;
    const retries = suiteOptions?.retries || options?.retries;
    let describeFn: any = describe;

    if (skip) describeFn = describe.skip;
    else if (only) describeFn = describe.only;

    const suiteOptionsObj: any = {};
    if (mode === 'serial') suiteOptionsObj.sequential = true;
    else if (mode === 'parallel') suiteOptionsObj.parallel = true;
    if (timeout) suiteOptionsObj.timeout = timeout;
    if (retries) suiteOptionsObj.retries = retries;

    const suiteBody = () => {
      const instance = new Class();
      this.#registerBeforeAllHook(Class);
      this.#walkProto(instance);
      this.#registerAfterAllHook(Class);
    };

    if (Object.keys(suiteOptionsObj).length > 0) {
      describeFn(name ?? Class.name, suiteOptionsObj, suiteBody);
    } else {
      describeFn(name ?? Class.name, suiteBody);
    }
  };

  /**
   * Test decorator factory
   * @param name - Test name (optional, defaults to method name)
   */
  #test =
    (name?: string) =>
    (target: any, propertyKey: string, descriptor: PropertyDescriptor) =>
      Reflect.defineMetadata(Test, { name }, descriptor.value);

  /**
   * Skip decorator factory
   */
  #skip = () => (target: any, propertyKey: string, descriptor: PropertyDescriptor) =>
    Reflect.defineMetadata(Skip, true, descriptor.value);

  /**
   * Only decorator factory
   */
  #only = () => (target: any, propertyKey: string, descriptor: PropertyDescriptor) =>
    Reflect.defineMetadata(Only, true, descriptor.value);

  /**
   * Todo decorator factory
   */
  #todo = () => (target: any, propertyKey: string, descriptor: PropertyDescriptor) =>
    Reflect.defineMetadata(Todo, true, descriptor.value);

  /**
   * Timeout decorator factory
   * @param ms - Timeout in milliseconds (must be positive)
   */
  #timeout = (ms: number) => {
    if (typeof ms !== 'number' || ms <= 0) {
      throw new VitestTimeoutInvalidError(ms);
    }
    return (target: any, propertyKey: string, descriptor: PropertyDescriptor) =>
      Reflect.defineMetadata(Timeout, [ms], descriptor.value);
  };

  /**
   * Repeats decorator factory
   * @param count - Number of repeats (must be positive)
   * @param options - Repeat options
   */
  #repeats = (count: number, options?: { mode?: 'series' | 'queue' }) => {
    if (typeof count !== 'number' || count <= 0) {
      throw new VitestRepeatsInvalidError(count);
    }
    return (target: any, propertyKey: string, descriptor: PropertyDescriptor) =>
      Reflect.defineMetadata(Repeats, [count, options], descriptor.value);
  };

  /**
   * @deprecated Use `#repeats` instead. Mocha compatibility decorator.
   * Retries decorator factory for Mocha migration
   * @param count - Number of retries (must be non-negative)
   */
  #retries = (count: number) => {
    showDeprecationWarning('retries', 'Use @repeats(count, { mode: "series" }) instead.');
    if (typeof count !== 'number' || count < 0) {
      throw new VitestRepeatsInvalidError(count);
    }
    return (target: any, propertyKey: string, descriptor: PropertyDescriptor) =>
      Reflect.defineMetadata(Repeats, [count, { mode: 'series' }], descriptor.value);
  };

  /**
   * @deprecated Use `#suite` with `{ mode: 'parallel' }` instead. Mocha compatibility decorator.
   * Parallel decorator factory for Mocha migration
   * @param enabled - Whether to enable parallel execution
   */
  #parallel = (enabled: boolean) => (target: any) => {
    showDeprecationWarning(
      'parallel',
      'Use @suite("name", { mode: "parallel" }) instead.',
    );
    if (enabled) {
      const existing = Reflect.getMetadata(Suite, target) || {};
      Reflect.defineMetadata(Suite, { ...existing, mode: 'parallel' }, target);
    }
  };

  /**
   * @deprecated Use `#timeout` instead. Mocha compatibility decorator.
   * Slow decorator factory for Mocha migration
   * @param ms - Slow threshold in milliseconds
   */
  #slow = (ms: number) => {
    showDeprecationWarning('slow', 'Use @timeout(ms) instead.');
    if (typeof ms !== 'number' || ms <= 0) {
      throw new VitestTimeoutInvalidError(ms);
    }
    // In Vitest, slow tests are handled differently - we just store the metadata
    // for potential reporting purposes
    return (target: any, propertyKey: string, descriptor: PropertyDescriptor) =>
      Reflect.defineMetadata(Timeout, [ms], descriptor.value);
  };

  /**
   * @deprecated Use `#skip` instead. Mocha compatibility decorator.
   * Pending decorator factory for Mocha migration
   */
  #pending = () => {
    showDeprecationWarning('pending', 'Use @skip() or @todo() instead.');
    return (target: any, propertyKey: string, descriptor: PropertyDescriptor) =>
      Reflect.defineMetadata(Todo, true, descriptor.value);
  };

  /**
   * @deprecated Params are handled differently in Vitest. Mocha compatibility decorator.
   * Params decorator factory for Mocha migration
   * @param paramsList - List of parameter sets
   */
  #params = (...paramsList: any[][]) => {
    showDeprecationWarning('params', "Use Vitest's native parameterized tests instead.");
    return (target: any, propertyKey: string, descriptor: PropertyDescriptor) =>
      Reflect.defineMetadata('params', paramsList, descriptor.value);
  };

  /**
   * @deprecated Use Allure step API directly. Mocha compatibility decorator.
   * Step decorator for Mocha migration
   * @param nameFn - Step name or function
   */
  #allureStep = (nameFn: string) => {
    showDeprecationWarning('allureStep', 'Use allure.step() directly instead.');
    // For compatibility - just store metadata, don't wrap the function
    return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
      const original = descriptor.value;
      if (typeof original === 'function') {
        // Store step name in metadata for potential future use
        const existingSteps = Reflect.getMetadata('allureSteps', descriptor.value) || [];
        existingSteps.push(nameFn);
        Reflect.defineMetadata('allureSteps', existingSteps, descriptor.value);
      }
      return descriptor;
    };
  };

  /**
   * @deprecated Use Allure attachment API directly. Mocha compatibility decorator.
   * Attachment decorator for Mocha migration
   * @param name - Attachment name
   * @param content - Attachment content
   * @param type - Content type
   */
  #attachment = (name: string, content: string | Buffer, type?: string) => {
    showDeprecationWarning('attachment', 'Use allure.attachment() directly instead.');
    return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
      // Store attachment metadata for later processing
      const existingAllure = Reflect.getMetadata(Allure, descriptor.value) || {};
      if (!existingAllure.attachment) {
        existingAllure.attachment = [[name, content, type]];
      } else if (Array.isArray(existingAllure.attachment[0])) {
        existingAllure.attachment = [...existingAllure.attachment, [name, content, type]];
      } else {
        existingAllure.attachment = [existingAllure.attachment, [name, content, type]];
      }
      Reflect.defineMetadata(Allure, existingAllure, descriptor.value);
      return descriptor;
    };
  };

  /**
   * @deprecated Use `#id` instead. Mocha compatibility decorator.
   * TestCaseId decorator for Mocha migration
   * @param id - Test case ID
   */
  #testCaseId = (id: string) => {
    showDeprecationWarning('testCaseId', 'Use @id(id) instead.');
    return (target: any, propertyKey: string, descriptor: PropertyDescriptor) =>
      Reflect.defineMetadata('testCaseId', id, descriptor.value);
  };

  /**
   * @deprecated Data decorator for Mocha compatibility (parameterized tests).
   * Use Vitest's native parameterized tests instead.
   * @param params - Test parameters
   * @param name - Optional test name
   */
  #data = (params: any, name?: string) => {
    showDeprecationWarning('data', "Use Vitest's native parameterized tests instead.");
    return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
      // Store data parameters for potential future use
      const existingData = Reflect.getMetadata('data', descriptor.value) || [];
      existingData.push({ params, name });
      Reflect.defineMetadata('data', existingData, descriptor.value);
      return descriptor;
    };
  };

  /**
   * Set Allure metadata method for a test
   * @param target - Method or class target
   * @param method - Allure method name (e.g., 'epic', 'severity')
   * @param args - Method arguments
   * @param append - Whether to append to existing metadata
   */
  #setAllureMethod = (target: any, method: string, args: any[], append = false): void => {
    let allureOptions: AllureMetadata | undefined;
    try {
      allureOptions = Reflect.getMetadata(Allure, target);
    } catch {
      allureOptions = undefined;
    }

    if (!allureOptions) allureOptions = {};

    if (!allureOptions[method]) {
      allureOptions[method] = append ? [args] : args;
    } else {
      allureOptions[method] = append
        ? [...(allureOptions[method] as any[][]), args]
        : args;
    }

    Reflect.defineMetadata(Allure, allureOptions, target);
  };

  /**
   * Register beforeAll hook if it exists
   * @param Class - Test class
   */
  #registerBeforeAllHook(Class: new () => any): void {
    if ('beforeAll' in Class && typeof (Class as any).beforeAll === 'function') {
      beforeAll((Class as any).beforeAll.bind(Class));
    }
  }

  /**
   * Register afterAll hook if it exists
   * @param Class - Test class
   */
  #registerAfterAllHook(Class: new () => any): void {
    if ('afterAll' in Class && typeof (Class as any).afterAll === 'function') {
      afterAll((Class as any).afterAll.bind(Class));
    }
  }

  /**
   * Register beforeEach hook if it exists
   * @param instance - Class instance
   */
  #registerBeforeHook(instance: any): void {
    if ('before' in instance && typeof instance.before === 'function') {
      beforeEach(async () => instance.before());
    }
  }

  /**
   * Register afterEach hook if it exists
   * @param instance - Class instance
   */
  #registerAfterHook(instance: any): void {
    if ('after' in instance && typeof instance.after === 'function') {
      afterEach(async () => instance.after());
    }
  }
}

/**
 * Export all decorator factories as named exports
 */
export const {
  suite,
  test,
  skip,
  only,
  todo,
  timeout,
  repeats,
  retries,
  parallel,
  slow,
  pending,
  params,
  context,
  allureStep,
  attachment,
  testCaseId,
  data,
  label,
  link,
  id,
  epic,
  feature,
  story,
  allureSuite,
  parentSuite,
  subSuite,
  owner,
  severity,
  tag,
  tags,
  description,
  issue,
} = new Vitest();

/**
 * @deprecated Use Allure API directly. For Mocha compatibility.
 * Decorate Allure instance
 */
export const decorate = (allureInstance: any) => {
  showDeprecationWarning(
    'decorate',
    'Use Allure API directly from allure-js-commons instead.',
  );
  // In Vitest, Allure is used directly from allure-js-commons
  // This is a no-op for compatibility
};

/**
 * @deprecated Use environment variables or config. For Mocha compatibility.
 * Assign PMS URL
 */
export const assignPmsUrl = (url: string) => {
  showDeprecationWarning('assignPmsUrl', 'Use environment variables instead.');
  // Store in environment for compatibility
  process.env.PMS_URL = url;
};

/**
 * @deprecated Use environment variables or config. For Mocha compatibility.
 * Assign TMS URL
 */
export const assignTmsUrl = (url: string) => {
  showDeprecationWarning('assignTmsUrl', 'Use environment variables instead.');
  // Store in environment for compatibility
  process.env.TMS_URL = url;
};
