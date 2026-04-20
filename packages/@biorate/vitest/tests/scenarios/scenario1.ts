import { Scenario, Step } from '../../src';
import { expect } from 'vitest';

export class SubScenario1 extends Scenario {
  @Step()
  protected async step0() {
    console.log('SubScenario1.step0 - Navigate to Google');
    // Simulated step
    expect(true).toBe(true);
  }
}

export class Scenario1 extends SubScenario1 {
  @Step('Scenario1, test step 1')
  protected async step1() {
    console.log('Scenario1.step1 - Open Google');
    // Simulated step
    expect(true).toBe(true);
  }

  @Step()
  protected async step2() {
    console.log('Scenario1.step2 - Verify title');
    // Simulated verification
    expect(true).toBe(true);
  }
}
