import { expect, Scenario, Step } from '../../src';

export class SubScenario1 extends Scenario {
  @Step()
  protected async step0() {
    await this.page.goto('https://google.com/');
    await expect(this.page).toHaveTitle(/Google/);
  }
}

export class Scenario1 extends SubScenario1 {
  @Step('Scenario1, test step 1')
  protected async step1() {
    await this.page.goto('https://google.com/');
  }

  @Step()
  protected async step2() {
    await expect(this.page).toHaveTitle(/Google/);
  }
}
