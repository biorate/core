declare module '@biorate/async-loop' {
  export class AsyncLoop {
    public constructor(
      process: () => Promise<void> | void,
      error?: () => Promise<void> | void,
      interval?: number,
    ): void;

    public pause(): void;

    public resume(): void;

    public stop(): void;

    protected process(): Promise<void>;
  }
}
