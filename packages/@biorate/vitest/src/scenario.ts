import { TestContext } from 'vitest';
import { Scenario as ScenarioCommon } from '@biorate/run-context';
import { Scenario as ScenarioSymbol } from './symbols';

/**
 * Base scenario class for reusable test steps
 */
export abstract class Scenario extends ScenarioCommon {
  /**
   * Get the test context from the scenario
   * @returns Test context with all fixtures
   */
  protected get context(): TestContext {
    return this.ctx.get<TestContext>('context');
  }
}

/**
 * Step decorator for marking scenario methods
 * @param name - Optional step name for Allure reporting
 * @returns Method decorator
 */
export const Step = (name?: string) => (target: any, context: any) =>
  Reflect.defineMetadata(ScenarioSymbol, { name }, target);
