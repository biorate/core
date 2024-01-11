import { Scenario as ScenarioCommon } from '@biorate/run-context';
import { Scenario as ScenarioSymbol } from './symbols';
import { Page } from './';

export abstract class Scenario extends ScenarioCommon {
  protected get page() {
    return <Page>this.ctx.get<Page>('page');
  }
}

export const step = (name?: string) => (target: any, context: any) =>
  Reflect.defineMetadata(ScenarioSymbol, { name }, target);
