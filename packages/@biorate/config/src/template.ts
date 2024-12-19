import { Config } from './config';
import { RegExpExt } from './reg-exp-ext';
import { IResult } from '../interfaces';

export class Template {
  public static string<T = unknown>(
    this: Config,
    value: string,
    result: IResult,
    def?: T,
  ) {
    if (!Config.Template.string) return;
    let regExp = /\${([^}{]+)+?}/g,
      res;
    while ((res = regExp.exec(value)))
      if (this.has(res[1]))
        result.value = (<string>result.value).replace(
          res[0],
          String(this.get<T>(res[1], def)),
        );
  }

  public static link<T = unknown>(this: Config, value: string, result: IResult, def?: T) {
    if (!Config.Template.link) return;
    let regExp = /^#{([^}{]+)+?}$/g;
    const match = regExp.exec(value)?.[1];
    if (match) result.value = this.get<T>(match, def);
  }

  public static regexp<T = unknown>(
    this: Config,
    value: string,
    result: IResult,
    def?: T,
  ) {
    if (!Config.Template.regexp) return;
    let regExp = /^R\{\/(.*?)\/([^\/]*)}$/;
    const match = regExp.exec(value);
    if (match?.[1]) result.value = new RegExpExt(match?.[1], match?.[2] ?? '');
  }

  public static function<T = unknown>(
    this: Config,
    value: string,
    result: IResult,
    def?: T,
  ) {
    if (!Config.Template.function) return;
    let regExp = /^F\{([^=>]+) => ([^}]+)}$/g;
    const match = regExp.exec(value);
    if (match?.[1] && match?.[2])
      result.value = <() => unknown>(
        new Function(...match?.[1].trim().split(/\s*,\s*/), match?.[2].trim()).bind({})
      );
  }

  public static empty<T = unknown>(
    this: Config,
    value: string,
    result: IResult,
    def?: T,
  ) {
    if (!Config.Template.empty) return;
    let regExp = /^!{([^}{]+)+?}$/g;
    const match = regExp.exec(value)?.[1];
    if (match) {
      if (match === 'object') result.value = {};
      else if (match === 'array') result.value = [];
      else if (match === 'void') result.value = undefined;
      else if (match === 'null') result.value = null;
      else if (match === 'string') result.value = '';
      else result.value = null;
    }
  }
}
