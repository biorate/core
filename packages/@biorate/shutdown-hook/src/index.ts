import { env } from '@biorate/tools';
import { IHook, Reasons } from './interfaces';

export * from './interfaces';

export class ShutdownHook {
  static #hooks = new Set<IHook>();

  static #instance: ShutdownHook;

  private static create() {
    if (!this.#instance) this.#instance = new this();
    return this.#instance;
  }

  public static subscribe(callback: IHook) {
    this.create();
    this.#hooks.add(callback);
    return this.#instance;
  }

  public static unsubscribe(callback: IHook) {
    this.create();
    this.#hooks.delete(callback);
    return this.#instance;
  }

  #isShutdown = false;

  #inProcess = false;

  #code = 0;

  private constructor() {
    env.globalThis?.process?.on('uncaughtException', () => (this.#code = 1));
    env.globalThis?.process?.on('unhandledRejection', () => (this.#code = 2));
    env.globalThis?.process?.on('beforeExit', this.#beforeExit);
    env.globalThis?.process?.on('SIGINT', () => this.#onShutdown(Reasons.SIGINT));
    env.globalThis?.process?.on('SIGTERM', () => this.#onShutdown(Reasons.SIGTERM));
    env.globalThis?.addEventListener?.('beforeunload', () =>
      this.#onShutdown(Reasons.EXIT),
    );
  }

  #beforeExit = () => {
    if (!this.#isShutdown) setImmediate(() => this.#onShutdown(Reasons.EXIT));
  };

  #onShutdown = async (reason: Reasons) => {
    if (this.#inProcess) return;
    this.#inProcess = true;
    await Promise.all([...ShutdownHook.#hooks].map((fn) => fn(reason)));
    this.#inProcess = false;
    this.#isShutdown = true;
    process.exit(this.#code);
  };
}
