import { ExecSyncOptions, ExecOptions, execSync, exec } from 'child_process';
import { template, omit } from 'lodash';
import { time } from '@biorate/tools';
import { Singleton } from '@biorate/singleton';
import { Config } from './config';
import { CommandStatuses } from './enums';
import { CommandExecutionError } from './errors';

export * from './enums';
export * from './errors';

/**
 * @description
 * Command executor common interface
 *
 * @example
 * ```
 * import { CommonCommandSync, CommonCommandAsync } from '@biorate/command';
 *
 * export class EchoSyncCommand extends CommonCommandSync {
 *   protected command = [`echo #{value}`];
 *
 *   protected override options = { cwd: '/tmp' };
 *
 *   public static override execute(options: { value: string | number }) {
 *     return super.execute(options);
 *   }
 * }
 *
 * export class EchoAsyncCommand extends CommonCommandAsync {
 *   protected command = [`echo #{value}`];
 *
 *   protected override options = { cwd: '/tmp' };
 *
 *   public static override execute(options: { value: string | number }) {
 *     return super.execute(options);
 *   }
 * }
 * ```
 */
export abstract class CommonCommand extends Singleton {
  public static execute(params?: Record<string, any>) {
    return this.instance<CommonCommand>().execute(params);
  }

  #config = new Config();

  protected abstract command: string[];

  protected options: ExecSyncOptions | ExecOptions = { encoding: 'utf8' };

  protected params: Record<string, any> = {};

  protected interpolate = /[#|$]{([\s\S]+?)}/g;

  protected get name() {
    return this.constructor.name;
  }

  protected get default() {
    return {};
  }

  protected async execute(params?: Record<string, any>): Promise<Buffer | string> {
    const diff = time.diff();
    try {
      this.#config.clear();
      this.#config.merge(this.default);
      this.#config.merge(this.params);
      this.#config.merge(params ?? {});
      this.#config.merge({ $options: this.options });
      const config = this.#config.all();
      const result = this.format(await this.exec(config));
      this.log(CommandStatuses.Completed, diff());
      return result;
    } catch (e: any) {
      this.log(CommandStatuses.Failed, diff());
      throw new CommandExecutionError(this.name, e);
    }
  }

  protected format(result: string | Buffer) {
    return result;
  }

  protected log(status: string, time: number) {
    console.info(` * [${this.name}] status [${status}] at ${time.toFixed(2)}ms`);
  }

  protected templatize(config: Record<string, any>) {
    return template(this.command.join(' ').trim(), { interpolate: this.interpolate })(
      omit(config, '$options'),
    );
  }

  protected abstract exec(config: Record<string, any>): Promise<string | Buffer>;
}

export abstract class CommonCommandSync extends CommonCommand {
  protected async exec(config: Record<string, any>) {
    return execSync(this.templatize(config), <ExecSyncOptions>config.$options);
  }
}

export abstract class CommonCommandAsync extends CommonCommand {
  protected stderr = true;

  protected exec(config: Record<string, any>) {
    return new Promise<string | Buffer>((resolve, reject) =>
      exec(
        this.templatize(config),
        <ExecOptions>config.$options,
        (error, stdout, stderr) => {
          if (error) return void reject(error);
          resolve(this.stderr ? stderr + stdout : stdout);
        },
      ),
    );
  }
}
