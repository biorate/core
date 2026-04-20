import * as allure from 'allure-js-commons';
import { Context as ContextCommon } from '@biorate/run-context';
import { Scenario as ScenarioSymbol } from './symbols';

/**
 * Context manager for running test scenarios with Allure integration
 */
export class Context extends ContextCommon {
  protected static metaKey = ScenarioSymbol;

  /**
   * Execute a step with Allure reporting
   * @param step - Step function to execute
   * @returns Promise that resolves when step completes
   */
  protected static async runStep(step: () => void | Promise<void>): Promise<void> {
    const meta = Reflect.getMetadata(this.metaKey, step);
    const stepName = meta?.name ?? (step?.name?.replace('bound ', '') || 'unknown');

    await allure.step(stepName, async () => await step());
  }
}
