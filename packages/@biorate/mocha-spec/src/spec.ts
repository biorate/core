import { Unit } from './unit';
import { Validator } from './validator';
import { IUnitOptions, IValidatorOptions } from '../interfaces';

export abstract class Spec {
  protected testDir = 'tests';

  #validator = new Validator();

  #unit = new Unit(this.testDir);

  protected unit(options: IUnitOptions) {
    return this.#unit.process(options);
  }

  protected validate(options: IValidatorOptions) {
    return this.#validator.validate(options);
  }
}
