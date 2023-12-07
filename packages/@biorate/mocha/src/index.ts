import * as core from './core';
// @ts-ignore
import * as p from 'mocha.parallel';

function applyTimings(fn: any, settings: any): any {
  if (settings) {
    if (fn.length === 1) {
      return core.wrap(function (done: any) {
        if (settings.retries !== undefined) {
          // @ts-ignore: TODO
          this.retries(settings.retries);
        }
        if (settings.slow !== undefined) {
          // @ts-ignore: TODO
          this.slow(settings.slow);
        }
        if (settings.timeout !== undefined) {
          // @ts-ignore: TODO
          this.timeout(settings.timeout);
        }
        // @ts-ignore: TODO
        return fn.call(this, done);
      }, fn);
    } else {
      return core.wrap(function () {
        if (settings.retries !== undefined) {
          // @ts-ignore: TODO
          this.retries(settings.retries);
        }
        if (settings.slow !== undefined) {
          // @ts-ignore: TODO
          this.slow(settings.slow);
        }
        if (settings.timeout !== undefined) {
          // @ts-ignore: TODO
          this.timeout(settings.timeout);
        }
        // @ts-ignore: TODO
        return fn.call(this);
      }, fn);
    }
  } else {
    return fn;
  }
}

const mochaRunner: core.TestRunner = {
  suite(name: string, callback: () => void, settings?: core.SuiteSettings): void {
    console.log(settings);
    const suite = settings?.parallel ? p : describe;
    switch (settings && settings.execution) {
      case 'only':
        suite.only(name, applyTimings(callback, settings));
        break;
      case 'skip':
        suite.skip(name, applyTimings(callback, settings));
        break;
      case 'pending':
        suite.skip(name, applyTimings(callback, settings));
        break;
      default:
        suite(name, applyTimings(callback, settings));
    }
  },

  test(
    name: string,
    callback: core.CallbackOptionallyAsync,
    settings?: core.TestSettings,
  ): void {
    switch (settings && settings.execution) {
      case 'only':
        it.only(name, applyTimings(callback, settings));
        break;
      case 'skip':
        it.skip(name, applyTimings(callback, settings));
        break;
      case 'pending':
        it(name);
        break;
      default:
        it(name, applyTimings(callback, settings));
    }
  },

  beforeAll(
    name: string,
    callback: core.CallbackOptionallyAsync,
    settings?: core.LifecycleSettings,
  ): void {
    before(applyTimings(callback, settings));
  },

  beforeEach(
    name: string,
    callback: core.CallbackOptionallyAsync,
    settings?: core.LifecycleSettings,
  ): void {
    beforeEach(applyTimings(callback, settings));
  },

  afterEach(
    name: string,
    callback: core.CallbackOptionallyAsync,
    settings?: core.LifecycleSettings,
  ): void {
    afterEach(applyTimings(callback, settings));
  },

  afterAll(
    name: string,
    callback: core.CallbackOptionallyAsync,
    settings?: core.LifecycleSettings,
  ): void {
    after(applyTimings(callback, settings));
  },
};

class MochaClassTestUI extends core.ClassTestUI {
  // TODO: skipOnError, @context
  public constructor(runner: core.TestRunner = mochaRunner) {
    super(runner);
  }
}

const mochaDecorators = new MochaClassTestUI();

interface MochaClassTestUI {
  readonly context: unique symbol;
}

export const {
  context,
  suite,
  test,
  slow,
  timeout,
  parallel,
  retries,
  pending,
  only,
  skip,
  params,
} = mochaDecorators;
