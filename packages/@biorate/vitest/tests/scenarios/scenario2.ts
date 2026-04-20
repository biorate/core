import { Scenario, Step } from '../../src';
import { expect } from 'vitest';

export class Scenario2 extends Scenario {
  @Step()
  protected async step1() {
    console.log('Scenario2.step1 - Navigate to Google');
    // Simulated step
    expect(true).toBe(true);
  }

  @Step()
  protected async step2() {
    console.log('Scenario2.step2 - Verify title');
    // Simulated verification
    expect(true).toBe(true);
  }
}
