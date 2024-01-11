import { Scenario, step } from '../../src';

export class Scenario2 extends Scenario {
  @step()
  protected async step1() {
    console.log('step1');
  }

  @step()
  protected async step2() {
    console.log('step2');
  }
}
