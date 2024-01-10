import { Scenario, step } from '../../../src';

export class SubScenario1 extends Scenario {
  @step()
  protected async step0() {
    this.ctx.set(this.step0.name + '-' + this.constructor.name, true);
  }
}

export class Scenario1 extends SubScenario1 {
  @step()
  protected async step1() {
    this.ctx.set(this.step1.name + '-' + this.constructor.name, true);
  }

  @step()
  protected async step2() {
    this.ctx.set(this.step2.name + '-' + this.constructor.name, true);
  }
}
