import { expect, Page, Scenario, step } from '../../src';

export class SubScenario1 extends Scenario {
  @step()
  protected async step0() {
  }
}

export class Scenario1 extends SubScenario1 {
  @step()
  protected async step1() {
    await this.page.goto('https://playwright.dev/');
  }

  @step()
  protected async step2() {
    await expect(this.page).toHaveTitle(/Playwright/);
  }
}
