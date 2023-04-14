export enum Reasons {
  EXIT = 'EXIT',
  SIGINT = 'SIGINT',
  SIGTERM = 'SIGTERM',
}

export type IHook = (reason?: Reasons) => unknown | Promise<unknown>;
