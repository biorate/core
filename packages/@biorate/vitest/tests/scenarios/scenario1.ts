import { Scenario, Step } from '../../src';

export class SubScenario1 extends Scenario {
  @Step()
  protected async step0() {
    this.ctx.set(`${this.step0.name}-${this.constructor.name}`, true);
  }
}

export class Scenario1 extends SubScenario1 {
  @Step('Scenario1, test step 1')
  protected async step1() {
    this.ctx.set(`${this.step1.name}-${this.constructor.name}`, true);
  }

  @Step()
  protected async step2() {
    this.ctx.set(`${this.step2.name}-${this.constructor.name}`, true);
  }
}
