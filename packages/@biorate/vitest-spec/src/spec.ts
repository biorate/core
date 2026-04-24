import * as nock from 'nock';
import supertest from 'supertest';
import { expect, vi } from 'vitest';
import { api } from './api';
import { Unit } from './unit';
import { Validator } from './validator';
import { IUnitOptions, IValidatorOptions } from './interfaces';
import { getRequire } from '@biorate/node-tools';

export abstract class Spec {
  static #mocks() {
    const requireFn = getRequire();
    try {
      return requireFn('sinon');
    } catch {
      return vi;
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
    return expect;
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
    return expect;
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
    return expect(result, message).toEqual(exp);
  }
}
