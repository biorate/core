import { Batcher } from './index';

export type IMetadata = Record<string | symbol, unknown>;

export type ITask<M = IMetadata> = {
  resolve: (value: any) => void;
  reject: (reason?: any) => void;
  metadata?: M;
};

export interface IBatcher<O = unknown, M = IMetadata> {
  register(callback: (tasks: [O, ITask<M>][]) => void): void;

  rollback(tasks: [O, ITask<M>][]): void;

  add(object: O, metadata?: M): Promise<unknown>;
}
