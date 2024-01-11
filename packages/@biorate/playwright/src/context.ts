import { allure } from 'allure-playwright';
import { Context as ContextCommon } from '@biorate/run-context';
import { Scenario as ScenarioSymbol } from './symbols';

export class Context extends ContextCommon {
  protected static metaKey = ScenarioSymbol;

  protected static async runStep(step: () => void | Promise<void>) {
    await allure.step(
      step?.name?.replace?.('bound ', '') || 'unknown',
      async () => await step(),
    );
  }
}
