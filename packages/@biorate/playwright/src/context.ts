import { Context as ContextCommon } from '@biorate/run-context';
import { Scenario as ScenarioSymbol } from './symbols';

export class Context extends ContextCommon {
  protected static metaKey = ScenarioSymbol;
}
