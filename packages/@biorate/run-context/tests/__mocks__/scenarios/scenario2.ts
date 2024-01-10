import { Scenario, step } from '../../../src';

export class Scenario2 extends Scenario {
  @step()
  protected async step1() {
    this.ctx.set(this.step1.name + '-' + this.constructor.name, true);
  }

  @step()
  protected async step2() {
    this.ctx.set(this.step2.name + '-' + this.constructor.name, true);
  }
}
