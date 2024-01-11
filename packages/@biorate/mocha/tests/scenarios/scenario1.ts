import { Scenario, step, allureStep } from '../../src';

class SubScenario1 extends Scenario {
  @step()
  protected async step0() {
    console.log('step0');
  }
}

export class Scenario1 extends SubScenario1 {
  @step('Scenario1, test step 1')
  protected async step1() {
    console.log('step1');
  }

  @step()
  protected async step2() {
    console.log('step2');
  }
}
