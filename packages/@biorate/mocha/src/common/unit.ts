import 'mocha-chai-jest-snapshot';
import * as fs from 'fs';
import { path } from '@biorate/tools';
import { expect } from 'chai';
import { get, invoke } from 'lodash';
import { IUnitOptions } from '../interfaces';
import { MochaChaiJestSnapshotError } from '../errors';

export class Unit {
  private static defaultExt = 'json';

  private static id = 0;

  private static init = false;

  private static match(
    object: any,
    expects: string | string[] | boolean | undefined,
    options: IUnitOptions,
    type: string,
  ) {
    let values: (string | string[] | boolean | undefined)[] = [];
    if (typeof expects === 'string' || Array.isArray(expects))
      for (const path of Array.isArray(expects) ? expects : [expects])
        values.push(get(object, path));
    else if (typeof expects === 'boolean' && expects) values.push(object);
    if (!expect?.(object)?.toMatchSnapshot) throw new MochaChaiJestSnapshotError();
    for (const value of values) {
      expect(object).toMatchSnapshot(
        `[${type}] doesn't equal in [${options.method}] method`,
      );
    }
  }

  private static args(options: IUnitOptions, testDir: string, argsDir: string) {
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
        ext === Unit.defaultExt ? '[]' : 'export default [];',
        'utf-8',
      );
      Unit.init = true;
    }
    return ext === Unit.defaultExt ? require(file) : require(file).default;
  }

  protected argsDir = '__unit-args__';

  public constructor(protected testDir: string) {}

  public async process(options: IUnitOptions) {
    let result: unknown;
    const { context, method, expects } = options;
    const args = Unit.args(options, this.testDir, this.argsDir);
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
