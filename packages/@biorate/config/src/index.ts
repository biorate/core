import { injectable } from '@biorate/inversion';
import { merge, get, has, set, PropertyPath } from 'lodash';
import * as traverse from 'traverse';
import { UndefinedConfigPathError } from './errors';
import { IConfig } from '../interfaces';
export * from '../interfaces';
export * from './errors';

@injectable()
export class Config implements IConfig {
  /**
   * @description Data storage
   * */
  protected data = {};

  /**
   * @description Set template value
   * */
  protected template(value: string) {
    let res,
      result = value,
      regExp = /\${([^}{]+)+?}/g;
    while ((res = regExp.exec(value)))
      if (this.has(res[1])) result = result.replace(res[0], this.get(res[1]));
    regExp = /^#{([^}{]+)+?}$/g;
    const match = regExp.exec(value)?.[1];
    if (match) result = this.get(match);
    return result;
  }

  /**
   * @description Walk object recursive to templatize internal values
   * */
  protected templatize(object: unknown) {
    const template = this.template.bind(this);
    return traverse(object).forEach(function (value) {
      if (typeof value === 'string') this.update(template(value));
    });
  }

  /**
   * @description Get config property by path
   * @param path - data path
   * @param def - default value
   * @example
   * ```
   * import { Config } from '@biorate/config';
   *
   * const config = new Config();
   *
   * config.set('a', 1);
   *
   * console.log(config.get('a')); // 1
   * console.log(config.get('b', 2)); // 2
   * console.log(config.get('b')); // UndefinedConfigPathError: Undefined config path [b]
   *                               //  at Config.get (src/index.ts:2:1608)
   *                               //  at Context.<anonymous> (tests/index.spec.ts:19:24)
   *                               //  at processImmediate (node:internal/timers:464:21)
   *
   * ```
   * */
  public get<T = unknown>(path: PropertyPath, def?: T): T {
    if (!this.has(path)) {
      if (def === undefined) throw new UndefinedConfigPathError(path);
      return def;
    }
    const result: any = get(this.data, path);
    switch (typeof result) {
      case 'string':
        return <T>(<unknown>this.template(result));
      case 'object':
        return result ? this.templatize(result) : result;
      default:
        return result;
    }
  }

  /**
   * @description Has config property by path
   * @param path - data path
   * @example
   * ```
   * import { Config } from '@biorate/config';
   *
   * const config = new Config();
   *
   * config.set('a', 1);
   *
   * console.log(config.has('a')); // true
   * ```
   * */
  public has(path: PropertyPath) {
    return has(this.data, path);
  }

  /**
   * @description Set config property by path
   * @param path - data path
   * @param value - data value
   * @example
   * ```
   * import { Config } from '@biorate/config';
   *
   * const config = new Config();
   *
   * config.set('a', 1);
   *
   * console.log(config.get('a')); // 1
   * ```
   * */
  public set(path: PropertyPath, value: unknown) {
    set(this.data, path, value);
  }

  /**
   * @description Merge config data
   * @param data - data object
   * @example
   * ```
   * import { Config } from '@biorate/config';
   *
   * const config = new Config();
   *
   * config.merge({
   *   a: { b: { c: 1 } },
   * });
   *
   * config.merge({
   *   a: { b: { d: 2 } },
   * });
   *
   * console.log(config.has('a')); // true
   * console.log(config.has('a.b')); // true
   * console.log(config.get('a.b.c')); // 1
   * console.log(config.get('a.b.d')); // 2
   * ```
   * */
  public merge(data: unknown) {
    merge(this.data, data);
  }
}
