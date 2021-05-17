import { EventEmitter } from 'events';
import { prop } from '@biorate/tools/src/define';
import { observe } from 'mobx';
import { startsWith, isFunction, isObject } from 'lodash';
import { DateTime } from 'luxon';
import { Types, Props } from './symbols';

export class Item extends EventEmitter {
  public static Int = Types.Int;
  public static String = Types.String;
  public static UnsafeString = Types.UnsafeString;
  public static Float = Types.Float;
  public static Bool = Types.Bool;
  public static Date = Types.Date;
  public static Object = Types.Object;
  public static Array = Types.Array;
  public static Json = Types.Json;
  public static File = Types.File;
  public static Map = Types.Map;
  public static Set = Types.Set;
  public static Luxon = Types.Luxon;

  public static observe(item, callback = (...any) => any) {
    try {
      item[Props.Disposer] = observe(item, (...args) => {
        if (item instanceof Item)
          for (const callback of item.#callbacks) callback(...args);
        if (item[Props.OnObserve]) item[Props.OnObserve](...args);
        else callback(...args);
      });
    } catch {
      item[Props.Disposer] = () => {};
    }
  }

  #callbacks: Set<(...args) => void> = new Set();

  #defineClass = (data, field, Class) => {
    if (!(this[field] instanceof Class)) this[field] = new Class(this, data[field]);
    this[field].initialize?.(data[field]);
  };

  #saveType = (data, field) => {
    if (!(field in this[Props.types])) this[Props.types][field] = this[field];
  };

  #getType = (data, field) => {
    let type = Reflect.getMetadata(Props.Class, Object.getPrototypeOf(this), field);
    if (!type) type = this[Props.types][field];
    return type;
  };

  #set = (data, field) => {
    const type = this.#getType(data, field);
    switch (type) {
      case Item.Int:
        this[field] = parseInt(data[field], 10) || 0;
        break;
      case Item.Float:
        this[field] = parseFloat(data[field]) || 0;
        break;
      case Item.UnsafeString:
        this[field] = String(data[field]);
        break;
      case Item.Bool:
        this[field] = Boolean(data[field]);
        break;
      case Item.Date:
        this[field] = new Date(data[field]);
        break;
      case Item.Luxon:
        this[field] = DateTime.fromISO(data[field]);
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
      case Item.File:
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

  #validate = (data, field) => {
    data = data || {};
    this.#saveType(data, field);
    this.#set(data, field);
  };

  public constructor(parent = null) {
    super();
    for (const name of [
      '_events',
      '_eventsCount',
      '_maxListeners',
      'setMaxListeners',
      'getMaxListeners',
      'emit',
      'on',
      'off',
      'once',
      'addListener',
      'removeListener',
      'prependListener',
      'prependOnceListener',
      'removeAllListeners',
      'listeners',
      'rawListeners',
      'eventNames',
      'listenerCount',
    ])
      prop(this, name, this[name], 'cw');
    prop(this)(Props.parent, parent, 'c')(Props.types, {}, 'w');
    Item.observe(this);
  }

  public subscribe(callback: (...args) => void) {
    this.#callbacks.add(callback);
    return this;
  }

  public unsubscribe(callback: (...args) => void) {
    this.#callbacks.delete(callback);
    return this;
  }

  public update(data: Record<string, any>) {
    for (const field in data) this.#set(data, field);
  }

  public initialize(data?: Record<string, any>) {
    for (const field in this) {
      if (!this.hasOwnProperty(field)) continue;
      this.#validate(data, field);
    }
    return this;
  }

  public toJSON(...args: any[]) {
    let value, isObject;
    const result: Record<string, any> = {};
    for (const field in this) {
      if (!this.hasOwnProperty(field)) continue;
      value = this[field];
      isObject = typeof value === 'object';
      if (value == null) result[field] = value;
      else if (isObject && value instanceof Map) result[field] = [...value];
      else if (isObject && value instanceof Set) result[field] = [...value];
      else if (isObject && value instanceof DateTime) result[field] = value.toISOString();
      else if (isObject && isFunction(value.toJSON))
        result[field] = value.toJSON(...args);
      else result[field] = value;
    }
    return result;
  }

  public format(...args: any[]) {
    let value, isObject;
    const result: Record<string, any> = {};
    for (const field in this) {
      if (!this.hasOwnProperty(field)) continue;
      if (startsWith(field, '_')) continue;
      value = this[field];
      isObject = typeof value === 'object';
      if (value == null) result[field] = value;
      else if (isObject && value instanceof Map) result[field] = [...value];
      else if (isObject && value instanceof Set) result[field] = [...value];
      else if (isObject && value instanceof Date) result[field] = +value;
      else if (isObject && value instanceof DateTime) result[field] = value.toISOString();
      else if (isObject && isFunction(value.format))
        result[field] = value.format(...args);
      else result[field] = value;
    }
    return result;
  }

  [Props.OnObserve](...args) {
    this[Props.parent]?.[Props.OnObserve]?.(...args);
  }
}
