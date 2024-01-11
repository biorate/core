import { object as o } from '@biorate/tools';
import { Scenario as ScenarioSymbol } from './symbols';
import { RunContextKeyAlreadyExistsError } from './errors';
/**
 * @description Create context and run scenarios
 *
 * @example
 * ```
 * import { Scenario, Context, step } from '@biorate/run-context';
 *
 * export class Scenario1 extends Scenario {
 *   @step()
 *   protected async step1() {
 *     this.ctx.set('step1', true);
 *   }
 *
 *   @step()
 *   protected async step2() {
 *     this.ctx.set('step2', 1);
 *   }
 * }
 *
 * export class Scenario2 extends Scenario {
 *   @step()
 *   protected async step3() {
 *     this.ctx.set('step3', false);
 *   }
 * }
 *
 * (async () => {
 *   const ctx = await Context.run([Scenario1, Scenario2], { initial: 'value' });
 *   console.log(ctx.get<boolean>('step1')); // true
 *   console.log(ctx.get<number>('step2')); // 1
 *   console.log(ctx.get<boolean>('step3')); // false
 *   console.log(ctx.get()); // {
 *   //    'step1': true,
 *   //    'step2': 1,
 *   //    'step3': false
 *   //  }
 * })();
 * ```
 */
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
          if (!descriptor?.value) continue;
          const meta = Reflect.getMetadata(this.metaKey, descriptor.value);
          if (!meta) continue;
          const step = scenario[name].bind(scenario);
          Reflect.defineMetadata(this.metaKey, { name: meta.name }, step);
          steps.push(step);
        }
      }
      for (const step of steps) await this.runStep(step);
    }
    return instance;
  }

  protected static metaKey = ScenarioSymbol;

  protected static async runStep(step: () => void | Promise<void>) {
    await step();
  }

  #ctx: Record<string, any> = {};

  protected constructor(ctx: Record<string, any>) {
    for (const key in ctx) this.set(key, ctx[key]);
  }

  public set(key: string, value: any) {
    if ('key' in this.#ctx) throw new RunContextKeyAlreadyExistsError();
    this.#ctx[key] = value;
  }

  public get<T = unknown>(key?: string) {
    return key ? <T>this.#ctx[key] : this.#ctx;
  }

  public del(key: string) {
    return delete this.#ctx[key];
  }
}
