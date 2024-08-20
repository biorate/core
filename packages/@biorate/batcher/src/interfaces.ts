export type IMetadata = Record<string | symbol, unknown>;

export type ITask<M = IMetadata> = {
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
  metadata?: M;
};

export interface IBatcher<O = unknown, M = IMetadata> {
  register(callback: (tasks: [O, ITask<M>][]) => void | Promise<void>): void;

  rollback(tasks: [O, ITask<M>][]): void;

  add(object: O, metadata?: M): Promise<unknown>;

  force(): Promise<void>;
}
