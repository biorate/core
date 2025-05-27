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

  #extend =
    (params: Record<string, any>) =>
    (target: any, propertyKey: string, descriptor: PropertyDescriptor) =>
      Reflect.defineMetadata(Extends, params, target);

  #test =
    (name?: string) =>
    (target: any, propertyKey: string, descriptor: PropertyDescriptor) =>
      Reflect.defineMetadata(Test, { name }, target);

  #skip =
    () =>
    (target: any, ...args: any[]) => {
      Reflect.defineMetadata(Skip, true, target);
    };

  #only =
    () =>
    (target: any, ...args: any[]) =>
      Reflect.defineMetadata(Only, true, target);

  #slow =
    (...opts: any[]) =>
    (target: any, ...args: any[]) =>
      Reflect.defineMetadata(Slow, opts, target);

  #label =
    (name: string, value: string) =>
    (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
      this.#setAllureMethod(target, 'label', [name, value], true);
    };

  #link =
    (url: string, name: string, type?: string) =>
    (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
      this.#setAllureMethod(target, 'link', type ? [url, name, type] : [url, name]);
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
    (epic: string) =>
    (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
      this.#setAllureMethod(target, 'feature', [epic]);
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
      this.#setAllureMethod(target, 'issue', url ? [name, url] : [name]);
    };

  #description =
    (value: string) =>
    (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
      this.#setAllureMethod(target, 'description', [value]);
    };

  protected before(instance: any) {
    if (this.before.name in instance)
      t.beforeEach(wrapEach(instance[this.before.name].bind(instance)));
  }

  protected after(instance: any) {
    if (this.after.name in instance)
      t.afterEach(wrapEach(instance[this.after.name].bind(instance)));
  }

  protected beforeAll(Class: any) {
    if (Class.before) t.beforeAll(wrapAll(Class.before.bind(Class)));
  }

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
