import { IDefine } from '../interfaces';

export function prop(context: {}, field?: string, value?: any, mods: IDefine.Mods = '') {
  function define(field: string, value: any, mods: IDefine.Mods = '') {
    Object.defineProperty(context, field, {
      value: value,
      enumerable: mods && mods.includes('e'),
      configurable: mods && mods.includes('c'),
      writable: mods && mods.includes('w'),
    });
    return define;
  }
  if (arguments.length > 1) return define(field, value, mods);
  else return define;
}

export function accessor(
  context: {},
  field?: string,
  accessor?: IDefine.Accessor,
  mods?: string,
) {
  function define(field: string, accessor: IDefine.Accessor, mods?: string) {
    const descriptor = {
      enumerable: mods && mods.includes('e'),
      configurable: mods && mods.includes('c'),
      get: undefined,
      set: undefined,
    };
    if (accessor.get) descriptor.get = accessor.get;
    if (accessor.set) descriptor.set = accessor.set;
    Object.defineProperty(context, field, descriptor);
    return define;
  }
  if (arguments.length > 1) return define(field, accessor, mods);
  else return define;
}
