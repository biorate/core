import { object as o } from '@biorate/tools';
import * as allure from 'allure-js-commons';
import {
  test as t,
  TestInfo,
  Page,
  BrowserContext,
  Browser,
  APIRequestContext,
} from '@playwright/test';
import { Test, Skip, Only, Slow, Allure, Suite, Extends } from './symbols';
import { wrapAll, wrapEach } from './utils';
import { TestArgs } from '../interfaces';

export * from 'allure-playwright';
export * from 'playwright';
export * from '@playwright/test';
export * as allure from 'allure-js-commons';

/**
 * @description
 * Main class that provides OOP decorators for Playwright tests with Allure integration.
 *
 * Exposes the following decorators:
 * - `@suite(name?)` — define a test suite
 * - `@test(name?)` — define a test method
 * - `@skip()` — skip a test/suite
 * - `@only()` — run only this test/suite
 * - `@slow(...opts)` — mark test as slow
 * - `@extend(params)` — extend test fixtures
 * - Allure annotations: `@label`, `@link`, `@id`, `@epic`, `@feature`, `@story`,
 *   `@allureSuite`, `@parentSuite`, `@subSuite`, `@owner`, `@severity`, `@tag`,
 *   `@tags`, `@issue`, `@description`
 *
 * A singleton instance is created at module level and its decorators are exported directly.
 *
 * @example
 * ```ts
 * import { suite, test, epic, feature, severity } from '@biorate/playwright';
 * import { Severity } from 'allure-js-commons';
 *
 * @suite('Login')
 * class LoginTest {
 *   @epic('Auth')
 *   @feature('Login')
 *   @severity(Severity.CRITICAL)
 *   @test('should login')
 *   async shouldLogin({ page }: TestArgs) {
 *     await page.goto('/login');
 *     // ...
 *   }
 * }
 * ```
 */
export class PlayWright {
  public readonly suite;

  public readonly extend;

  public readonly test;

  public readonly skip;

  public readonly only;

  public readonly slow;

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

  public constructor() {
    this.suite = this.#suite;
    this.extend = this.#extend;
    this.test = this.#test;
    this.skip = this.#skip;
    this.only = this.#only;
    this.slow = this.#slow;

    this.label = this.#label;
    this.link = this.#link;
    this.id = this.#id;
    this.epic = this.#epic;
    this.feature = this.#feature;
    this.story = this.#story;
    this.allureSuite = this.#allureSuite;
    this.parentSuite = this.#parentSuite;
    this.subSuite = this.#subSuite;
    this.owner = this.#owner;
    this.severity = this.#severity;
    this.tag = this.#tag;
    this.tags = this.#tags;
    this.issue = this.#issue;
    this.description = this.#description;
  }

  /**
   * @description Walk the prototype chain of an instance and register test methods.
   */
  protected walkProto(instance: any) {
    const methods = new Set();
    this.before(instance);
    this.after(instance);
    o.walkProto(instance, (object: any) => {
      const names = Object.getOwnPropertyNames(object);
      for (const name of names) {
        if (methods.has(name)) return;
        methods.add(name);
        const descriptor = Object.getOwnPropertyDescriptor(object, name);
        const meta = Reflect.getMetadata(Test, descriptor?.value);
        if (!meta) continue;
        const allureMethods = Reflect.getMetadata(Allure, descriptor?.value);
        const skip = Reflect.getMetadata(Skip, descriptor?.value);
        const only = Reflect.getMetadata(Only, descriptor?.value);
        const slow = Reflect.getMetadata(Slow, descriptor?.value);
        const extend = Reflect.getMetadata(Extends, descriptor?.value);
        if (skip && only)
          throw new Error(`Can't use both "@skip()" and "@only()" decorators`);
        let test: any = extend ? t.extend(extend) : t;
        if (skip) test = t.skip;
        else if (only) test = t.only;
        // @ts-ignore
        test(
          meta.name ?? name,
          async function (
            { page, context, browser, browserName, request }: TestArgs,
            info: TestInfo,
          ) {
            for (const method in allureMethods) {
              if (method in allure) {
                // @ts-ignore
                const args: any = allure[method];
                if (Array.isArray(allureMethods[method]?.[0]))
                  for (const params of allureMethods[method]) await args(...params);
                else await args(...allureMethods[method]);
              }
            }
            if (slow) test.slow(...slow);
            // eslint-disable-next-line prefer-rest-params
            await instance[name](
              {
                page,
                context,
                browser,
                browserName,
                request,
                ...extend,
              },
              info,
            );
          },
        );
      }
    });
  }

  /**
   * @description Decorator that defines a test suite.
   */
  #suite = (name?: string) => (Class: any) => {
    const self = this;
    const skip = Reflect.getMetadata(Skip, Class);
    const only = Reflect.getMetadata(Only, Class);
    if (skip && only)
      throw new Error(`Can't use both "@skip()" and "@only()" decorators`);
    let describe: any = t.describe;
    if (skip) describe = t.describe.skip;
    else if (only) describe = t.describe.only;
    describe(name ?? Class.name, function () {
      const instance = new Class();
      const options = Reflect.getMetadata(Suite, Class);
      for (const name in options) {
        // @ts-ignore
        if (!(name in this)) continue;
        // @ts-ignore
        if (typeof this[name] === 'function') this[name](options[name]);
        // @ts-ignore
        else this[name] = options[name];
      }
      self.beforeAll(Class);
      self.walkProto(instance);
      self.afterAll(Class);
    });
  };

  #setAllureMethod = (target: any, method: string, args: string[], append = false) => {
    let allureOptions: Record<string, string[] | string[][]> | undefined =
      Reflect.getMetadata(Allure, target);
    if (!allureOptions) allureOptions = {};
    if (!allureOptions[method]) allureOptions[method] = append ? [args] : args;
    else
      allureOptions[method] = append
        ? [...(<string[][]>allureOptions[method]), args]
        : args;
    Reflect.defineMetadata(Allure, allureOptions, target);
  };

  /**
   * @description Decorator to extend test fixtures with custom values.
   */
  #extend =
    (params: Record<string, any>) =>
    (target: any, propertyKey: string, descriptor: PropertyDescriptor) =>
      Reflect.defineMetadata(Extends, params, target);

  /**
   * @description Decorator that marks a method as a test.
   */
  #test =
    (name?: string) =>
    (target: any, propertyKey: string, descriptor: PropertyDescriptor) =>
      Reflect.defineMetadata(Test, { name }, target);

  /**
   * @description Decorator that skips a test or suite.
   */
  #skip =
    () =>
    (target: any, ...args: any[]) => {
      Reflect.defineMetadata(Skip, true, target);
    };

  /**
   * @description Decorator that runs only this test or suite.
   */
  #only =
    () =>
    (target: any, ...args: any[]) =>
      Reflect.defineMetadata(Only, true, target);

  /**
   * @description Decorator that marks a test as slow.
   */
  #slow =
    (...opts: any[]) =>
    (target: any, ...args: any[]) =>
      Reflect.defineMetadata(Slow, opts, target);

  /** @description Allure label annotation. */
  #label =
    (name: string, value: string) =>
    (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
      this.#setAllureMethod(target, 'label', [name, value], true);
    };

  /** @description Allure link annotation. */
  #link =
    (url: string, name: string, type?: string) =>
    (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
      this.#setAllureMethod(target, 'link', type ? [url, name, type] : [url, name]);
    };

  /** @description Allure test id annotation. */
  #id =
    (id: string) =>
    (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
      this.#setAllureMethod(target, 'id', [id]);
    };

  /** @description Allure epic annotation. */
  #epic =
    (epic: string) =>
    (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
      this.#setAllureMethod(target, 'epic', [epic]);
    };

  /** @description Allure feature annotation. */
  #feature =
    (epic: string) =>
    (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
      this.#setAllureMethod(target, 'feature', [epic]);
    };

  /** @description Allure story annotation. */
  #story =
    (story: string) =>
    (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
      this.#setAllureMethod(target, 'story', [story]);
    };

  /** @description Allure suite annotation. */
  #allureSuite =
    (name: string) =>
    (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
      this.#setAllureMethod(target, 'suite', [name]);
    };

  /** @description Allure parent suite annotation. */
  #parentSuite =
    (name: string) =>
    (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
      this.#setAllureMethod(target, 'parentSuite', [name]);
    };

  /** @description Allure sub suite annotation. */
  #subSuite =
    (name: string) =>
    (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
      this.#setAllureMethod(target, 'subSuite', [name]);
    };

  /** @description Allure owner annotation. */
  #owner =
    (name: string) =>
    (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
      this.#setAllureMethod(target, 'owner', [name]);
    };

  /** @description Allure severity annotation. */
  #severity =
    (severity: string) =>
    (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
      this.#setAllureMethod(target, 'severity', [severity]);
    };

  /** @description Allure tag annotation. */
  #tag =
    (tag: string) =>
    (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
      this.#setAllureMethod(target, 'tag', [tag]);
    };

  /** @description Allure tags annotation (multiple). */
  #tags =
    (...tags: string[]) =>
    (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
      this.#setAllureMethod(target, 'tags', tags);
    };

  /** @description Allure issue annotation. */
  #issue =
    (name: string, url?: string) =>
    (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
      this.#setAllureMethod(target, 'issue', url ? [name, url] : [name]);
    };

  /** @description Allure description annotation. */
  #description =
    (value: string) =>
    (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
      this.#setAllureMethod(target, 'description', [value]);
    };

  /**
   * @description Register `beforeEach` hook from instance method.
   */
  protected before(instance: any) {
    if (this.before.name in instance)
      t.beforeEach(wrapEach(instance[this.before.name].bind(instance)));
  }

  /**
   * @description Register `afterEach` hook from instance method.
   */
  protected after(instance: any) {
    if (this.after.name in instance)
      t.afterEach(wrapEach(instance[this.after.name].bind(instance)));
  }

  /**
   * @description Register `beforeAll` hook from static class method.
   */
  protected beforeAll(Class: any) {
    if (Class.before) t.beforeAll(wrapAll(Class.before.bind(Class)));
  }

  /**
   * @description Register `afterAll` hook from static class method.
   */
  protected afterAll(Class: any) {
    if (Class.before) t.beforeAll(wrapAll(Class.after.bind(Class)));
  }
}

export const {
  suite,
  only,
  skip,
  slow,
  test,
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
  extend,
} = new PlayWright();
