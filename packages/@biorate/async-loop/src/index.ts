import { timer } from '@biorate/tools';

/**
 * @description Async loop implementation
 *
 * @example
 * ```
 * import { AsyncLoop } from '@biorate/async-loop';
 *
 * (async () => {
 *   let i = 0;
 *   const loop = new AsyncLoop(
 *     () => {
 *       console.log(++i); // 1, 2, 3 ... e.t.c
 *     },
 *     console.error,
 *     1000,
 *   );
 * })();
 * ```
 */
export class AsyncLoop {
  #process: () => Promise<void> | void;

  #error: (e: unknown) => Promise<void> | void;

  #interval: number;

  #paused = false;

  #stoped = false;

  public constructor(
    process: () => Promise<void> | void,
    error?: () => Promise<void> | void,
    interval = 1000,
  ) {
    this.#process = process;
    this.#error = error ?? console.error;
    this.#interval = interval;
    this.process().catch(this.#error);
  }

  public pause() {
    this.#paused = true;
  }

  public resume() {
    this.#paused = false;
  }

  public stop() {
    this.#stoped = true;
  }

  protected async process() {
    while (true) {
      await timer.wait(this.#interval);
      if (this.#paused) continue;
      if (this.#stoped) break;
      try {
        await this.#process();
      } catch (e: unknown) {
        await this.#error(e);
      }
    }
  }
}
