declare module '@biorate/run-context' {
  export class Context {
    public static run(scenarios: any[], ctx: Record<string, any> = {}): Promise<Context>;

    private constructor(ctx: Record<string, any>);

    public set(key: string, value: any): void;

    public get<T = unknown>(key: string): Record<string, any> | T;
  }

  export abstract class Scenario {
    public constructor(protected ctx: Context);
  }
}
