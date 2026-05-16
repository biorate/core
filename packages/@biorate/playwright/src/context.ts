import * as allure from 'allure-js-commons';
import { Context as ContextCommon } from '@biorate/run-context';
import { Scenario as ScenarioSymbol } from './symbols';

/**
 * @description
 * Playwright-aware context for running {@link Scenario} steps with Allure reporting.
 * Each step is automatically wrapped in `allure.step()`.
 */
export class Context extends ContextCommon {
  protected static metaKey = ScenarioSymbol;

  protected static async runStep(step: () => void | Promise<void>) {
    const meta = Reflect.getMetadata(this.metaKey, step);
    await allure.step(
      meta?.name ?? (step?.name?.replace?.('bound ', '') || 'unknown'),
      async () => await step(),
    );
  }
}
