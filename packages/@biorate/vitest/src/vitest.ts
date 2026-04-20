import { object as o } from '@biorate/tools';
import * as allure from 'allure-js-commons';
import {
  TestContext,
  it,
  describe,
  beforeEach,
  afterEach,
  beforeAll,
  afterAll,
} from 'vitest';
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
import { wrapHook } from './utils';
import { SuiteOptions } from './interfaces';

export * as allure from 'allure-js-commons';

export class Vitest {
  public readonly suite;
  public readonly test;
  public readonly skip;
  public readonly only;
  public readonly todo;
  public readonly timeout;
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

  public constructor() {
    this.suite = this.#suite;
    this.test = this.#test;
    this.skip = this.#skip;
    this.only = this.#only;
    this.todo = this.#todo;
    this.timeout = this.#timeout;
    this.repeats = this.#repeats;

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

  protected walkProto(instance: any) {
    const methods = new Set<string>();
    this.before(instance);
    this.after(instance);

    o.walkProto(instance, (object: any) => {
      const names = Object.getOwnPropertyNames(object);
      for (const name of names) {
        if (methods.has(name)) continue;
        methods.add(name);

        const descriptor = Object.getOwnPropertyDescriptor(object, name);
        const meta = Reflect.getMetadata(Test, descriptor?.value);
        if (!meta) continue;

        const allureMethods = Reflect.getMetadata(Allure, descriptor?.value);
        const skip = Reflect.getMetadata(Skip, descriptor?.value);
        const only = Reflect.getMetadata(Only, descriptor?.value);
        const todo = Reflect.getMetadata(Todo, descriptor?.value);
        const timeout = Reflect.getMetadata(Timeout, descriptor?.value);
        const repeats = Reflect.getMetadata(Repeats, descriptor?.value);
        const extend = Reflect.getMetadata(Extends, descriptor?.value);

        if (skip && only) {
          throw new Error('Cannot use both @skip() and @only() decorators');
        }

        let testFn: any = it;
        if (skip) testFn = it.skip;
        else if (only) testFn = it.only;
        else if (todo) testFn = it.todo;

        // Apply timeout and repeats to test function
        const testOptions: any = {};
        if (timeout) testOptions.timeout = timeout[0];
        if (repeats) {
          testOptions.repeats = repeats[0];
          if (repeats[1]?.mode) testOptions.mode = repeats[1].mode;
        }

        const testFunction = async function (context: TestContext & Record<string, any>) {
          // Apply Allure metadata
          for (const method in allureMethods) {
            if (method in allure) {
              const allureFn = (allure as any)[method];
              if (Array.isArray(allureMethods[method]?.[0])) {
                for (const params of allureMethods[method]) {
                  await allureFn(...params);
                }
              } else {
                await allureFn(...allureMethods[method]);
              }
            }
          }

          // Execute test method with extended context
          await instance[name]({
            ...context,
            ...extend,
          });
        };

        // Vitest 4: options as second argument
        if (Object.keys(testOptions).length > 0) {
          testFn(meta.name ?? name, testOptions, testFunction);
        } else {
          testFn(meta.name ?? name, testFunction);
        }
      }
    });
  }

  #suite = (name?: string, options?: SuiteOptions) => (Class: any) => {
    const self = this;
    const skip = Reflect.getMetadata(Skip, Class);
    const only = Reflect.getMetadata(Only, Class);
    const suiteOptions = Reflect.getMetadata(Suite, Class);

    if (skip && only) {
      throw new Error('Cannot use both @skip() and @only() decorators on suite');
    }

    // Determine suite mode
    const mode = suiteOptions?.mode || options?.mode;
    let describeFn: any = describe;

    if (skip) describeFn = describe.skip;
    else if (only) describeFn = describe.only;

    // Apply mode by calling the appropriate describe function
    if (mode === 'serial') {
      describe.sequential(name ?? Class.name, createSuiteBody(this, Class));
    } else if (mode === 'parallel') {
      describe.parallel(name ?? Class.name, createSuiteBody(this, Class));
    } else {
      describeFn(name ?? Class.name, createSuiteBody(this, Class));
    }
  };

  #setAllureMethod = (target: any, method: string, args: string[], append = false) => {
    let allureOptions: Record<string, string[] | string[][]> | undefined =
      Reflect.getMetadata(Allure, target);

    if (!allureOptions) allureOptions = {};

    if (!allureOptions[method]) {
      allureOptions[method] = append ? [args] : args;
    } else {
      allureOptions[method] = append
        ? [...(allureOptions[method] as string[][]), args]
        : args;
    }

    Reflect.defineMetadata(Allure, allureOptions, target);
  };

  #test =
    (name?: string) =>
    (target: any, propertyKey: string, descriptor: PropertyDescriptor) =>
      Reflect.defineMetadata(Test, { name }, descriptor.value);

  #skip = () => (target: any, propertyKey: string, descriptor: PropertyDescriptor) =>
    Reflect.defineMetadata(Skip, true, descriptor.value);

  #only = () => (target: any, propertyKey: string, descriptor: PropertyDescriptor) =>
    Reflect.defineMetadata(Only, true, descriptor.value);

  #todo = () => (target: any, propertyKey: string, descriptor: PropertyDescriptor) =>
    Reflect.defineMetadata(Todo, true, descriptor.value);

  #timeout =
    (ms: number) => (target: any, propertyKey: string, descriptor: PropertyDescriptor) =>
      Reflect.defineMetadata(Timeout, [ms], descriptor.value);

  #repeats =
    (count: number, options?: { mode?: 'series' | 'queue' }) =>
    (target: any, propertyKey: string, descriptor: PropertyDescriptor) =>
      Reflect.defineMetadata(Repeats, [count, options], descriptor.value);

  #label =
    (name: string, value: string) =>
    (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
      this.#setAllureMethod(target, 'label', [name, value], true);
    };

  #link =
    (url: string, name?: string, type?: string) =>
    (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
      const args: string[] = [url];
      if (name) args.push(name);
      if (type) args.push(type);
      this.#setAllureMethod(target, 'link', args);
    };

  #id =
    (id: string) =>
    (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
      this.#setAllureMethod(target, 'id', [id]);
    };

  #epic =
    (epic: string) =>
    (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
      this.#setAllureMethod(target, 'epic', [epic]);
    };

  #feature =
    (feature: string) =>
    (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
      this.#setAllureMethod(target, 'feature', [feature]);
    };

  #story =
    (story: string) =>
    (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
      this.#setAllureMethod(target, 'story', [story]);
    };

  #allureSuite =
    (name: string) =>
    (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
      this.#setAllureMethod(target, 'suite', [name]);
    };

  #parentSuite =
    (name: string) =>
    (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
      this.#setAllureMethod(target, 'parentSuite', [name]);
    };

  #subSuite =
    (name: string) =>
    (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
      this.#setAllureMethod(target, 'subSuite', [name]);
    };

  #owner =
    (name: string) =>
    (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
      this.#setAllureMethod(target, 'owner', [name]);
    };

  #severity =
    (severity: string) =>
    (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
      this.#setAllureMethod(target, 'severity', [severity]);
    };

  #tag =
    (tag: string) =>
    (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
      this.#setAllureMethod(target, 'tag', [tag]);
    };

  #tags =
    (...tags: string[]) =>
    (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
      this.#setAllureMethod(target, 'tags', tags);
    };

  #issue =
    (name: string, url?: string) =>
    (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
      const args: string[] = [name];
      if (url) args.push(url);
      this.#setAllureMethod(target, 'issue', args);
    };

  #description =
    (value: string) =>
    (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
      this.#setAllureMethod(target, 'description', [value]);
    };

  protected before(instance: any) {
    if (this.before.name in instance) {
      beforeEach(wrapHook(instance[this.before.name].bind(instance)));
    }
  }

  protected after(instance: any) {
    if (this.after.name in instance) {
      afterEach(wrapHook(instance[this.after.name].bind(instance)));
    }
  }

  protected beforeAll(Class: any) {
    if (Class.beforeAll) {
      beforeAll(Class.beforeAll.bind(Class));
    }
  }

  protected afterAll(Class: any) {
    if (Class.afterAll) {
      afterAll(Class.afterAll.bind(Class));
    }
  }
}

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

function createSuiteBody(self: any, Class: any) {
  return function (this: any) {
    const instance = new Class();
    self.beforeAll(Class);
    self.walkProto(instance);
    self.afterAll(Class);
  };
}
