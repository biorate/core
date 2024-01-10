import * as supertest from 'supertest';
import { Unit } from './unit';
import { Validator } from './validator';
import { IUnitOptions, IValidatorOptions } from './interfaces';

export abstract class Spec {
  protected testDir = 'tests';

  protected abstract get httpServer(): any;

  #supertest: supertest.SuperTest<supertest.Test>;

  #validator = new Validator();

  #unit = new Unit(this.testDir);

  protected get supertest() {
    if (!this.#supertest) this.#supertest = supertest(this.httpServer);
    return this.#supertest;
  }

  protected unit(options: IUnitOptions) {
    return this.#unit.process(options);
  }

  protected validate(options: IValidatorOptions) {
    return this.#validator.validate(options);
  }
}
