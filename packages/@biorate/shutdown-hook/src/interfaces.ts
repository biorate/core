export enum Reasons {
  UNCAUGHT_EXCEPTION = 'UNCAUGHT_EXCEPTION',
  UNHANDLED_REJECTION = 'UNHANDLED_REJECTION',
  EXIT = 'EXIT',
  SHUTDOWN = 'SHUTDOWN',
  SIGINT = 'SIGINT',
  SIGTERM = 'SIGTERM',
}

export type IHook = (reason?: Reasons) => unknown | Promise<unknown>;
