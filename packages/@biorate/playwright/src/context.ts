import { object as o } from '@biorate/tools';
import { Scenario as ScenarioSymbol } from './symbols';

export class Context {
  public static async run(scenarios: any[], ctx: Record<string, any> = {}) {
    const instance = new this(ctx);
    for (const Scenario of scenarios) {
      const scenario = new Scenario(instance);
      const methods = new Set();
      const steps: (() => void | Promise<void>)[] = [];
      const objects: any[] = [];
      o.walkProto(scenario, (object: any) => objects.unshift(object));
      for (const object of objects) {
        const names = Object.getOwnPropertyNames(object);
        for (const name of names) {
          if (methods.has(name)) continue;
          methods.add(name);
          const descriptor = Object.getOwnPropertyDescriptor(object, name);
          const meta = Reflect.getMetadata(ScenarioSymbol, descriptor?.value);
          if (!meta) continue;
          steps.push(scenario[name].bind(scenario));
        }
      }
      for (const step of steps) await step();
    }
  }

  #ctx = new Map<string, any>();

  private constructor(ctx: Record<string, any>) {
    for (const key in ctx) this.set(key, ctx[key]);
  }

  public set(key: string, value: any) {
    return this.#ctx.set(key, value);
  }

  public get<T = unknown>(key: string) {
    return <T>this.#ctx.get(key);
  }
}
