import { Config } from './config';
import { IResult } from '../interfaces';

export class Template {
  public static string(this: Config, value: string, result: IResult) {
    if (!Config.Template.string) return;
    let regExp = /\${([^}{]+)+?}/g,
      res;
    while ((res = regExp.exec(value)))
      if (this.has(res[1]))
        result.value = (<string>result.value).replace(res[0], this.get(res[1]));
  }

  public static link(this: Config, value: string, result: IResult) {
    if (!Config.Template.link) return;
    let regExp = /^#{([^}{]+)+?}$/g;
    const match = regExp.exec(value)?.[1];
    if (match) result.value = this.get(match);
  }

  public static regexp(this: Config, value: string, result: IResult) {
    if (!Config.Template.regexp) return;
    let regExp = /^R\{\/([^\/]+)\/([^\/]+)\}$/g;
    const match = regExp.exec(value);
    if (match?.[1] && match?.[2]) result.value = new RegExp(match?.[1], match?.[2]);
  }

  public static function(this: Config, value: string, result: IResult) {
    if (!Config.Template.function) return;
    let regExp = /^F\{([^=>]+) => ([^}]+)\}$/g;
    const match = regExp.exec(value);
    if (match?.[1] && match?.[2])
      result.value = <() => unknown>(
        new Function(...match?.[1].trim().split(/\s*,\s*/), match?.[2].trim()).bind({})
      );
  }
}
