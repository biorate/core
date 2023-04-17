export enum Reasons {
  EXIT = 'EXIT',
  SHUTDOWN = 'SHUTDOWN',
  SIGINT = 'SIGINT',
  SIGTERM = 'SIGTERM',
}

export type IHook = (reason?: Reasons) => unknown | Promise<unknown>;
