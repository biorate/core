import { promises as fs } from 'fs';
import { path } from '@biorate/tools';
import { init, injectable, inject, Types } from '@biorate/inversion';
import { IConfig } from '@biorate/config';

@injectable()
export abstract class Migrations {
  @inject(Types.Config) protected config: IConfig;

  protected get type() {
    return this.constructor.name.toLowerCase();
  }

  protected async scan(...args: string[]) {
    return (await fs.readdir(this.path(...args))).map((item) =>
      this.path(...args, item),
    );
  }

  protected path(...args: string[]) {
    return path.create(
      process.cwd(),
      this.config.get<string>('migrations.directory', 'migrations'),
      this.type,
      ...args,
    );
  }

  protected log(...args: string[]) {
    console.info(this.type, ...args, 'up!');
  }

  @init() protected async initialize() {
    await this.process();
  }

  protected abstract process();
}
