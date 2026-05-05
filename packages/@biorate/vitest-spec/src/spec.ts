import * as nock from 'nock';
import supertest from 'supertest';
import { createRequire } from 'module';
import { api } from './api.js';
import { Unit } from './unit.js';
import { Validator } from './validator.js';
import { IUnitOptions, IValidatorOptions } from './interfaces.js';

const vitest = globalThis as any;
const getExpect = () => vitest.expect;
const getVi = () => vitest.vi;

export abstract class Spec {
  static #mocks() {
    try {
      return createRequire(process.cwd() + '/')('sinon');
    } catch {
      return getVi();
    }
  }

  public static get nock() {
    return nock;
  }

  /*
   * @deprecated - use Spec.mocks instead
   **/
  public static get sinon() {
    return Spec.#mocks();
  }

  public static get mocks() {
    return Spec.#mocks();
  }

  public static get expect() {
    return getExpect();
  }

  protected testDir = 'tests';

  protected abstract get httpServer(): any;

  #supertest: any;

  #unit = new Unit(this.testDir);

  protected get supertest() {
    if (!this.#supertest) this.#supertest = supertest(this.httpServer);
    return this.#supertest;
  }

  protected get nock() {
    return nock;
  }

  /*
   * @deprecated - use this.mocks instead
   **/
  protected get sinon() {
    return Spec.mocks();
  }

  protected get mocks() {
    return Spec.mocks();
  }

  protected get expect() {
    return getExpect();
  }

  protected logReq(method: string, url: string, data: string) {}

  protected logRes(status: number, body: string) {}

  protected api(url?: string) {
    return api(
      url ? supertest(url) : this.supertest,
      this.logReq.bind(this),
      this.logRes.bind(this),
    );
  }

  protected unit(options: IUnitOptions) {
    return this.#unit.process(options);
  }

  protected validate(options: IValidatorOptions) {
    return Validator.validate(options);
  }

  protected exactly(result: any, exp: any, message?: string) {
    return getExpect()(result, message).toEqual(exp);
  }
}
