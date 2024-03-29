import { expect, Scenario, step } from '../../src';

export class Scenario2 extends Scenario {
  @step()
  protected async step1() {
    await this.page.goto('https://google.com');
  }

  @step()
  protected async step2() {
    await expect(this.page).toHaveTitle(/Google/);
  }
}
