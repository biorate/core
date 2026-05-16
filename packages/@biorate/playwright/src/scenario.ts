import { Scenario as ScenarioCommon } from '@biorate/run-context';
import { Scenario as ScenarioSymbol } from './symbols';
import { Page } from './';

/**
 * @description
 * Abstract base class for Playwright test scenarios.
 * Provides access to the current `page` from the test context.
 *
 * @example
 * ```ts
 * class LoginScenario extends Scenario {
 *   @Step('Open login page')
 *   async open() { await this.page.goto('/login'); }
 * }
 * ```
 */
export abstract class Scenario extends ScenarioCommon {
  protected get page() {
    return this.ctx.get<Page>('page');
  }
}

/**
 * @description
 * Decorator that marks a method as a named Allure step within a {@link Scenario}.
 *
 * @param name - Step display name in Allure report. Defaults to the method name.
 *
 * @example
 * ```ts
 * class MyScenario extends Scenario {
 *   @Step('Do something')
 *   async doSomething() { ... }
 * }
 * ```
 */
export const Step = (name?: string) => (target: any, context: any) =>
  Reflect.defineMetadata(ScenarioSymbol, { name }, target);
