import { expect, Scenario, Step } from '../../src';

export class Scenario2 extends Scenario {
  @Step()
  protected async step1() {
    await this.page.goto('https://google.com');
  }

  @Step()
  protected async step2() {
    await expect(this.page).toHaveTitle(/Google/);
  }
}
