import { IConfig } from '@biorate/config';
import { IBatcher, IMetadata, ITask } from './src';

declare module '@biorate/batcher' {
  export class Batcher<O = unknown, M = IMetadata> implements IBatcher<O, M> {
    protected config: IConfig;

    protected stamp: number;

    protected tasks: [O, ITask<M>][];

    protected callback: (tasks: [O, ITask<M>][]) => void | Promise<void>;

    protected unique: Set<symbol | string>;

    protected get count(): number;

    protected get timeout(): number;

    protected panic(e: Error): void;

    protected loop(): Promise<never>;

    protected key(object: O): symbol | string;

    protected deduplicate(tasks: [O, ITask<M>][]): ITask<M>[];

    protected process(): Promise<void>;

    public constructor();

    public register(callback: (tasks: [O, ITask<M>][]) => void | Promise<void>): void;

    public rollback(tasks: [O, ITask<M>][]): void;

    public add(object: O, metadata?: M): Promise<unknown>;

    public force(): Promise<void>;
  }
}
