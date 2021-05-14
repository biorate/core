import { define } from '../../src';
import { IDefine } from '../../interfaces';

export function prop(mods: IDefine.Mods, field = 'a', value = 1) {
  const obj = {};
  define.prop(obj, field, value, mods);
  return Object.getOwnPropertyDescriptor(obj, 'a');
}
