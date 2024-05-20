import { expect, Scenario, step } from '../../src';

export class SubScenario1 extends Scenario {
  @step()
  protected async step0() {
    await this.page.goto('https://google.com/');
    await expect(this.page).toHaveTitle(/Google/);
  }
}

export class Scenario1 extends SubScenario1 {
  @step('Scenario1, test step 1')
  protected async step1() {
    await this.page.goto('https://google.com/');
  }

  @step()
  protected async step2() {
    await expect(this.page).toHaveTitle(/Google/);
  }
}
