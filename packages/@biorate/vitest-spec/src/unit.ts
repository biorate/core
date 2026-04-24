import * as fs from 'fs';
import { path } from '@biorate/tools';
import { expect } from 'vitest';
import { get, invoke } from 'lodash';
import { IUnitOptions } from './interfaces';
import { VitestSnapshotError } from './errors';
import { getRequire } from '@biorate/node-tools';

export class Unit {
  private static defaultExt = 'json';

  private static id = 0;

  private static init = false;

  private static readonly requireFn: NodeRequire = getRequire();

  private static async loadArgs(file: string, ext: string) {
    if (ext === Unit.defaultExt) return JSON.parse(fs.readFileSync(file, 'utf-8'));
    const mod = Unit.requireFn(file);
    return (mod as any)?.default ?? mod;
  }

  private static match(
    object: any,
    expects: string | string[] | boolean | undefined,
    options: IUnitOptions,
    type: string,
  ) {
    let values: (string | string[] | boolean | undefined)[] = [];
    if (typeof expects === 'string' || Array.isArray(expects))
      for (const p of Array.isArray(expects) ? expects : [expects])
        values.push(get(object, p));
    else if (typeof expects === 'boolean' && expects) values.push(object);

    if (!expect?.({})?.toMatchSnapshot) throw new VitestSnapshotError();

    for (const value of values) {
      expect(value).toMatchSnapshot(
        `[${type}] doesn't equal in [${options.method}] method`,
      );
    }
  }

  private static async args(options: IUnitOptions, testDir: string, argsDir: string) {
    if (options.args) return Array.isArray(options.args) ? options.args : [];
    const dir = path.create(process.cwd(), testDir, argsDir);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    if (!options.context?.constructor?.name)
      throw new Error('Context have no constructor');
    const ext = options.ext ?? this.defaultExt;
    const file = path.create(
      dir,
      `${options.context?.constructor?.name}.${options.method}.${
        options.id ?? Unit.id
      }.${ext}`,
    );
    ++Unit.id;
    if (!fs.existsSync(file)) {
      fs.writeFileSync(
        file,
        ext === Unit.defaultExt ? '[]' : 'module.exports = [];',
        'utf-8',
      );
      Unit.init = true;
    }
    return await Unit.loadArgs(file, ext);
  }

  protected argsDir = '__unit-args__';

  public constructor(protected testDir: string) {}

  public async process(options: IUnitOptions) {
    let result: unknown;
    const { context, method, expects } = options;
    const args = await Unit.args(options, this.testDir, this.argsDir);
    if (Unit.init) return void (Unit.init = false);
    Unit.match(args, true, options, 'args before');
    Unit.match(context, expects?.context, options, 'context before');
    try {
      result = await invoke(context, method, ...args);
    } catch (e: any) {
      if (options?.catch?.(e)) return;
      throw e;
    }
    Unit.match(context, expects?.context, options, 'context after');
    Unit.match(args, expects?.args, options, 'args after');
    Unit.match(result, expects?.return, options, 'return');
  }
}
