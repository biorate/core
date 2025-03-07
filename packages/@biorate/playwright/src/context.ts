import * as allure from 'allure-js-commons';
import { Context as ContextCommon } from '@biorate/run-context';
import { Scenario as ScenarioSymbol } from './symbols';

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
