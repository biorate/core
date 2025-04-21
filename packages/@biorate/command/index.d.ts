declare module '@biorate/command' {
  export abstract class CommonCommand extends Singleton {
    public static execute(params?: Record<string, any>): Singleton;

    #config: Config;

    protected abstract command: string[];

    protected options: ExecSyncOptions | ExecOptions;

    protected params: Record<string, any>;

    protected interpolate: RegExp;

    protected get name(): string;

    protected get default(): Record<string, unknown>;

    protected async execute(params?: Record<string, any>): Promise<Buffer | string>;

    protected format(result: string | Buffer): string | Buffer;

    protected log(status: string, time: number): void;

    protected templatize(config: Record<string, any>): string;

    protected abstract exec(config: Record<string, any>): Promise<string | Buffer>;
  }

  export abstract class CommonCommandSync extends CommonCommand {
    protected exec(config: Record<string, any>): Promise<string | Buffer>;
  }

  export abstract class CommonCommandAsync extends CommonCommand {
    protected stderr: boolean;

    protected exec(config: Record<string, any>): Promise<string | Buffer>;
  }
}
