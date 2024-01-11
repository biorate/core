import { Context } from './context';
import { Scenario as ScenarioSymbol } from './symbols';
/**
 * @description Abstract Scenario class
 */
export abstract class Scenario {
  public constructor(protected ctx: Context) {}
}

export const step =
  (name?: string) => (target: any, propertyKey: string, descriptor: PropertyDescriptor) =>
    Reflect.defineMetadata(ScenarioSymbol, { name }, descriptor?.value);
