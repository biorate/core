import { TestContext } from 'vitest';
import { Scenario as ScenarioCommon } from '@biorate/run-context';
import { Scenario as ScenarioSymbol } from './symbols';

export abstract class Scenario extends ScenarioCommon {
  protected get context() {
    return this.ctx.get<TestContext>('context');
  }
}

export const Step = (name?: string) => (target: any, context: any) =>
  Reflect.defineMetadata(ScenarioSymbol, { name }, target);
