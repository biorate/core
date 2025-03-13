import * as supertest from 'supertest';
import * as nock from 'nock';
import * as sinon from 'sinon';
import * as chai from 'chai';
import type { Test, SuperTest } from 'supertest';
import { jestSnapshotPlugin } from 'mocha-chai-jest-snapshot';
import { api } from './api';
import { Unit } from './unit';
import { Validator } from './validator';
import { IUnitOptions, IValidatorOptions } from './interfaces';

chai.use(jestSnapshotPlugin());

export abstract class Spec {
  public static get nock() {
    return nock;
  }

  public static get sinon() {
    return sinon;
  }

  public static get chai() {
    return chai;
  }

  protected testDir = 'tests';

  protected abstract get httpServer(): any;

  #supertest: SuperTest<Test>;

  #unit = new Unit(this.testDir);

  protected get supertest() {
    if (!this.#supertest) this.#supertest = supertest(this.httpServer);
    return this.#supertest;
  }

  protected get nock() {
    return nock;
  }

  protected get sinon() {
    return sinon;
  }

  protected get chai() {
    return chai;
  }

  protected logReq(method: string, url: string, data: string) {}

  protected logRes(status: number, body: string) {}

  protected api(url?: string) {
    return api(
      url ? supertest(url) : this.#supertest,
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
}
