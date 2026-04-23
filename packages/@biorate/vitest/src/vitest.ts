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

const {
  it,
  describe,
  beforeEach,
  afterEach,
  beforeAll,
  afterAll,
} = globalThis as any;

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
    method: Function,
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
