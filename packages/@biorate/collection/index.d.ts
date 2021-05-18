import { EventEmitter } from 'events';
import { ICollection } from './interfaces';

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

    public static readonly bindings: Map<string | symbol | Function, symbol | Function>;

    public static bind(
      key: string | symbol | Function,
      val: symbol | Function,
    ): Map<string | symbol | Function, symbol | Function>;

    public constructor(data?: Record<string, any>, parent?: P);

    public initialize(data?: Record<string, any>): this;

    public get parent(): P;
  }

  export function observable(): void;

  export function action(): void;

  export function computed(): void;

  export function embed(type: any): void;

  export function inject(Class: ICollection.Ctor): void;

  export function singletone(): void;
}
