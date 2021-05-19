import { IDefine } from '../interfaces';

/**
 * @description
 * Reduction for Object.defineProperty method for define properties
 *
 * @param context - Object to define property
 * @param field - Property name
 * @param value - Property value
 * @param mods - Reduction for enumerable, configurable, writable - 'cwe' string, see [Mods](/modules/tools.idefine.html#mods)
 * @example
 * ```ts
 * import { define } from '@biorate/tools';
 *
 * const obj = {};
 *
 * define.prop(obj, 'test1', 1, 'cwe')
 *   ('test2', 2, 'c')
 *   ('test3', 3, '');
 *
 * console.log(obj); // { test1: 1 }
 * console.log(Object.getOwnPropertyDescriptor(obj, 'test1')); // { value: 1, writable: true, enumerable: true, configurable: true }
 * console.log(Object.getOwnPropertyDescriptor(obj, 'test2')); // { value: 2, writable: false, enumerable: false, configurable: true }
 * console.log(Object.getOwnPropertyDescriptor(obj, 'test3')); // { value: 3, writable: false, enumerable: false, configurable: false }
 * ```
 */
export function prop(
  context: any,
  field?: string | symbol,
  value?: any,
  mods: IDefine.Mods = '',
) {
  function define(field: string | symbol, value: any, mods: IDefine.Mods = '') {
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

/**
 * @description
 * Reduction for Object.defineProperty method for define accessors (getters and setters)
 *
 * @param context - Object to define property
 * @param field - Property name
 * @param accessor - [Accessors object](/modules/tools.idefine.html#accessor)
 * @param mods - Reduction for enumerable, configurable, writable - 'cwe' string, see [Mods](/modules/tools.idefine.html#mods)
 * @example
 * ```ts
 * import { define } from '@biorate/tools';
 * const obj = {
 *   _value: 0,
 * };
 *
 * define.accessor(
 * obj,
 * 'value',
 * {
 *     get() {
 *       return this._value;
 *     },
 *
 *     set(value: number) {
 *       this._value = value;
 *     },
 *   },
 * 'cw',
 * );
 *
 * console.log(obj); // { _value: 0 }
 * console.log(Object.getOwnPropertyDescriptor(obj, 'value'));
 *   // {
 *   //   get: [Function: get],
 *   //   set: [Function: set],
 *   //   enumerable: false,
 *   //   configurable: true
 *   // }
 * ```
 */
export function accessor(
  context: any,
  field?: string | symbol,
  accessor?: IDefine.Accessor,
  mods?: string,
) {
  function define(field: string | symbol, accessor: IDefine.Accessor, mods?: string) {
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
