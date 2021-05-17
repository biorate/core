import 'reflect-metadata';
import { define } from '@biorate/tools';
import { DateTime } from 'luxon';
import { isObject } from 'lodash';
import { Props, Types } from './symbols';

export class Item<P = { parent?: any }> {
  public static Int = Types.Int;
  public static String = Types.String;
  public static Float = Types.Float;
  public static Bool = Types.Bool;
  public static Date = Types.Date;
  public static Object = Types.Object;
  public static Array = Types.Array;
  public static Json = Types.Json;
  public static Map = Types.Map;
  public static Set = Types.Set;
  public static Luxon = Types.Luxon;

  public static bindings = new Map<string | symbol | Function, symbol | Function>();

  public static bind(key: string | symbol | Function, val: symbol | Function) {
    return this.bindings.set(key, val);
  }

  #defineClass = (
    data: Record<string, any>,
    field: string,
    Class: new (...args: any[]) => any,
  ) => {
    if (!(this[field] instanceof Class)) this[field] = new Class(data[field], this);
    this[field].initialize?.(data[field]);
  };

  #setType = (data: Record<string, any>, field: string) => {
    if (!(field in this[Props.types])) this[Props.types][field] = this[field];
  };

  #getType = (data: Record<string, any>, field: string) => {
    let type = Reflect.getMetadata(Props.Class, Object.getPrototypeOf(this), field);
    if (!type) type = this[Props.types][field];
    if (Item.bindings.has(type)) type = Item.bindings.get(type);
    return type;
  };

  #setData = (data: Record<string, any>, field: string) => {
    const type = this.#getType(data, field);
    switch (type) {
      case Item.Int:
        this[field] = parseInt(data[field], 10) || 0;
        break;
      case Item.Float:
        this[field] = parseFloat(data[field]) || 0;
        break;
      case Item.Bool:
        this[field] = Boolean(data[field]);
        break;
      case Item.Date:
        this[field] = new Date(data[field]);
        break;
      case Item.Luxon:
        this[field] =
          data[field] instanceof Date
            ? DateTime.fromJSDate(data[field])
            : typeof data[field] === 'string'
            ? DateTime.fromISO(data[field])
            : DateTime.fromMillis(data[field]);
        break;
      case Item.Object:
        this[field] = isObject(data[field]) ? data[field] : {};
        break;
      case Item.Array:
        this[field] = Array.isArray(data[field]) ? data[field] : [];
        break;
      case Item.Json:
        try {
          this[field] = JSON.parse(data[field]);
        } catch (e) {
          this[field] = null;
        }
        break;
      case Item.String:
        this[field] = data[field] ? String(data[field]) : '';
        break;
      case Item.Map:
        this[field] = new Map(Array.isArray(data[field]) ? data[field] : []);
        break;
      case Item.Set:
        this[field] = new Set(Array.isArray(data[field]) ? data[field] : []);
        break;
      default:
        if (type instanceof Function) {
          this.#defineClass(data, field, type);
        } else {
          if (field in data) this[field] = data[field];
        }
        break;
    }
  };

  #validate = (data: Record<string, any>, field: string) => {
    data = data || {};
    this.#setType(data, field);
    this.#setData(data, field);
  };

  public constructor(parent: P = null) {
    define.prop(this)(Props.parent, parent, 'c')(Props.types, {}, 'w');
  }

  public initialize(data?: Record<string, any>) {
    for (const field in this) {
      if (!this.hasOwnProperty(field)) continue;
      this.#validate(data, field);
    }
    return this;
  }

  public get parent(): P {
    return this[Props.parent];
  }
}
