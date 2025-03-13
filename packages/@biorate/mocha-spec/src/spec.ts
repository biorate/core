import * as supertest from 'supertest';
import { api } from './api';
import { Unit } from './unit';
import { Validator } from './validator';
import { IUnitOptions, IValidatorOptions } from './interfaces';

export abstract class Spec {
  protected testDir = 'tests';

  protected abstract get httpServer(): any;

  #supertest: supertest.SuperTest<supertest.Test>;

  #unit = new Unit(this.testDir);

  protected get supertest() {
    if (!this.#supertest) this.#supertest = supertest(this.httpServer);
    return this.#supertest;
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
