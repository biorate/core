import { merge, get, has } from 'lodash';
import * as traverse from 'traverse';

export class Config {
  protected data = {};

  protected template(value) {
    let res, result;
    const regExp = /\${([^}{]+)+?}/g;
    result = value;
    while ((res = regExp.exec(value)))
      if (this.has(res[1])) result = result.replace(res[0], this.get(res[1]));
    return result;
  }

  protected templatize(object) {
    const template = this.template.bind(this);
    return traverse(object).forEach(function (value) {
      if (typeof value === 'string') this.update(template(value));
    });
  }

  public get(path: string, def?: unknown) {
    if (!this.has(path)) {
      if (def === undefined) throw new Error(`Undefined path [${path}]`);
      return def;
    }
    const result = get(this.data, path);
    switch (typeof result) {
      case 'string':
        return this.template(result);
      case 'object':
        return result ? this.templatize(result) : result;
      default:
        return result;
    }
  }

  public has(path: string) {
    return has(this.data, path);
  }

  public merge(data: unknown): void {
    merge(this.data, data);
  }
}
