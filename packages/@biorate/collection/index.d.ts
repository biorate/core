import { EventEmitter } from 'events';
import { ICollection, Ctor } from './interfaces';

declare module '@biorate/collection' {
  export abstract class List<I = any, P = { parent?: any }> extends EventEmitter {
    static get index(): symbol;

    public constructor(items?: any[], parent?: P);

    [Symbol.iterator](): Generator<I>;

    protected get _set(): Set<I>;

    protected set _set(value);

    protected abstract get _keys(): ICollection.List.Keys;

    protected get _Item(): { new (...args): I } | null;

    public get parent(): P;

    public get size(): number;

    public get processed(): Record<string, any>;

    public set(...args: any[]): I[];

    public find(...args: any[]): I | undefined;

    public getBy(criteria: Record<string | symbol, any>, one?: boolean): I[];

    public get(...args: any[]): I[];

    public has(...args: any[]): boolean;

    public delete(...args: any[]): boolean;

    public clear(): void;
  }

  export class Item<P = { parent?: any }> {
    public static readonly Int: symbol;
    public static readonly String: symbol;
    public static readonly Float: symbol;
    public static readonly Bool: symbol;
    public static readonly Date: symbol;
    public static readonly Object: symbol;
    public static readonly Array: symbol;
    public static readonly Json: symbol;
    public static readonly Map: symbol;
    public static readonly Set: symbol;
    public static readonly Luxon: symbol;

    public static readonly bindings: Map<string | symbol | Function, Function>;

    public static bind(
      key: string | symbol | Function,
      val: Function,
    ): Map<string | symbol | Function, Function>;

    public constructor(data?: Record<string, any>, parent?: P);

    public initialize(data?: Record<string, any>): this;

    public set(data: Record<string, any>): this;

    public get parent(): P;
  }

  class ObservableItem<P = { parent?: any }> extends Item<P> {
    public subscribe(callback: (...args: any[]) => void): this;

    public unsubscribe(callback: (...args: any[]) => void): this;
  }

  abstract class ObservableList<I = any, P = { parent?: any }> extends List<I, P> {
    public subscribe(callback: (...args: any[]) => void): true;

    public unsubscribe(callback: (...args: any[]) => void): this;
  }

  export function observable(): (
    target: Object,
    key: string | symbol,
    descriptor?: PropertyDescriptor,
  ) => void;

  export function action(): (
    target: Object,
    key: string | symbol,
    descriptor?: PropertyDescriptor,
  ) => void;

  export function computed(): (
    target: Object,
    key: string | symbol,
    descriptor?: PropertyDescriptor,
  ) => void;

  export function embed(
    type: any,
  ): (target: Object, key: string | symbol, descriptor?: PropertyDescriptor) => void;

  export function singleton(): (Class: Ctor) => void;
}
