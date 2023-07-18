import { env } from '@biorate/tools';
import { IHook, Reasons } from './interfaces';

export * from './interfaces';

/**
 * @description Shutdown hook implementation for Node.JS
 *
 * @example
 * ```
 * import { ShutdownHook } from '@biorate/shutdown-hook';
 * import { timer } from '@biorate/tools';
 *
 * ShutdownHook.subscribe(async (reason) => {
 *   await timer.wait(100);
 *   console.log(reason); // 'SIGINT'
 * });
 *
 * process.kill(process.pid, 'SIGINT');
 * ```
 */
export class ShutdownHook {
  /**
   * @description Hooks registry
   */
  static #hooks = new Set<IHook>();
  /**
   * @description Singleton instance ref
   */
  static #instance: ShutdownHook;
  /**
   * @description Create instance
   */
  private static create() {
    if (!this.#instance) this.#instance = new this();
    return this.#instance;
  }
  /**
   * @description Subscribe handler for a shutdown event
   */
  public static subscribe(callback: IHook) {
    this.create();
    this.#hooks.add(callback);
    return this.#instance;
  }
  /**
   * @description Unsubscribe handler for a shutdown event
   */
  public static unsubscribe(callback: IHook) {
    this.create();
    this.#hooks.delete(callback);
    return this.#instance;
  }
  /**
   * @description Is shutdown complete
   */
  #isShutdown = false;
  /**
   * @description Is shutdown in process
   */
  #inProcess = false;
  /**
   * @description Exit code
   */
  #code = 0;
  /**
   * @description ShutdownHook private constructor
   */
  private constructor() {
    env.globalThis?.process?.on('exit', this.#exit);
    env.globalThis?.process?.on('uncaughtException', (e: Error) => this.#log(e, 1));
    env.globalThis?.process?.on('unhandledRejection', (e: Error) => this.#log(e, 2));
    env.globalThis?.process?.on('beforeExit', this.#beforeExit);
    env.globalThis?.process?.on('SIGINT', () => this.#onShutdown(Reasons.SIGINT));
    env.globalThis?.process?.on('SIGTERM', () => this.#onShutdown(Reasons.SIGTERM));
    env.globalThis?.addEventListener?.('beforeunload', () =>
      this.#onShutdown(Reasons.EXIT),
    );
  }
  /**
   * @description Log uncaughtException or unhandledRejection
   */
  #log = (e: Error, code: number) => {
    this.#code = code;
    console.error(e);
  };
  /**
   * @description Before exit handler
   */
  #beforeExit = () => {
    if (!this.#isShutdown) setImmediate(() => this.#onShutdown(Reasons.SHUTDOWN));
  };
  /**
   * @description Exit handler
   */
  #exit = () => {
    if (!this.#inProcess) this.#onShutdown(Reasons.EXIT);
  };
  /**
   * @description On shutdown main handler
   */
  #onShutdown = async (reason: Reasons) => {
    if (this.#inProcess) return;
    this.#inProcess = true;
    if (reason === Reasons.EXIT)
      console.warn(
        'WARNING! process.exit() method called! All shutdown hooks will be called synchronously!',
      );
    const result = await Promise.allSettled(
      [...ShutdownHook.#hooks].map((fn) => fn(reason)),
    );
    result.forEach(
      (result) => result.status === 'rejected' && console.error(result.reason),
    );
    this.#isShutdown = true;
    process?.exit?.(this.#code);
  };
}
