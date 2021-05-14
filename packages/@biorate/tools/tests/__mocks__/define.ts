import { define } from '../../src';
import { IDefine } from '../../interfaces';

export enum Properties {
  configurable = 'configurable',
  writable = 'writable',
  enumerable = 'enumerable',
}

export function prop(mods: IDefine.Mods, field = 'a', value = 1) {
  const obj = {};
  define.prop(obj, field, value, mods);
  return Object.getOwnPropertyDescriptor(obj, 'a');
}

export function accessors(
  mods: IDefine.Mods,
  field = 'a',
  value = { get() {}, set() {} },
) {
  const obj = {};
  define.accessor(obj, field, value, mods);
  return Object.getOwnPropertyDescriptor(obj, 'a');
}

export const conditions = new Map<IDefine.Mods, string[]>([
  ['c', [Properties.configurable]],
  ['w', [Properties.writable]],
  ['e', [Properties.enumerable]],
  ['ce', [Properties.configurable, Properties.enumerable]],
  ['we', [Properties.writable, Properties.enumerable]],
  ['cw', [Properties.configurable, Properties.writable]],
  ['cwe', [Properties.configurable, Properties.writable, Properties.enumerable]],
]);
