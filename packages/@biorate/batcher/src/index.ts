import { injectable, inject, Types } from '@biorate/inversion';
import { timer } from '@biorate/tools';
import { IConfig } from '@biorate/config';
import { ITask, IMetadata, IBatcher } from './interfaces';

export * from './interfaces';

/**
 * @description
 * Tasks batcher
 *
 * ### Features:
 * - Group single tasks into batch request
 *
 * @example
 * ```
 * import { inject, container, Types, Core } from '@biorate/inversion';
 * import { IConfig, Config } from '@biorate/config';
 * import { IBatcher, Batcher } from '@biorate/batcher';
 *
 * export class Root extends Core() {
 *   @inject(Types.Config) public config: IConfig;
 *   @inject(Types.Batcher) public batcher: IBatcher<{ data: string }, { test: string }>;
 * }
 *
 * container.bind<IConfig>(Types.Config).to(Config).inSingletonScope();
 * container
 *   .bind<IBatcher<{ data: string }, { test: string }>>(Types.Batcher)
 *   .to(Batcher<{ data: string }, { test: string }>)
 *   .inSingletonScope();
 * container.bind<Root>(Root).toSelf().inSingletonScope();
 *
 * (async () => {
 *   const root = <Root>container.get<Root>(Root);
 *   root.batcher.register(async (tasks) => {
 *     for (const task of tasks)
 *       task[1].resolve();
 *   });
 *   root.batcher.add({ data: 'one' }, { test: 'one' }).then(() => console.log('resolve 1')); // resolve 3
 *   root.batcher.add({ data: 'two' }, { test: 'two' }).then(() => console.log('resolve 2')); // resolve 3
 *   root.batcher
 *     .add({ data: 'three' }, { test: 'three' })
 *     .then(() => console.log('resolve 3')); // resolve 3
 * })();
 * ```
 */
@injectable()
export class Batcher<O = unknown, M = IMetadata> implements IBatcher<O, M> {
  @inject(Types.Config) protected config: IConfig;

  protected stamp = Date.now();
  protected tasks: [O, ITask<M>][] = [];
  protected callback: (tasks: [O, ITask<M>][]) => void;
  protected unique = new Set<symbol | string>();

  protected get count() {
    return this.config.get('Batcher.count', 100);
  }

  protected get timeout() {
    return this.config.get('Batcher.timeout', 100);
  }

  protected panic(e: Error) {
    console.error(e);
    process.exit(1);
  }

  protected async loop() {
    while (true) {
      await timer.wait();
      await this.process();
    }
  }

  protected key(object: O): symbol | string {
    return Symbol();
  }

  protected deduplicate(tasks: [O, ITask<M>][]) {
    this.unique.clear();
    for (let i = tasks.length; i--; ) {
      const key = this.key(tasks[i][0]);
      if (!this.unique.has(key)) this.unique.add(key);
      else this.tasks.push(...tasks.splice(i, 1));
    }
    return tasks;
  }

  protected async process() {
    if (!this.callback) return;
    if (this.stamp > Date.now() && this.tasks.length < this.count) return;
    this.stamp = Date.now() + this.timeout;
    if (this.tasks.length) {
      const tasks = this.tasks.slice();
      this.tasks.length = 0;
      await this.callback(this.deduplicate(tasks));
    }
  }

  public constructor() {
    this.loop().catch(this.panic);
  }

  public register(callback: (tasks: [O, ITask<M>][]) => void) {
    this.callback = callback;
  }

  public rollback(tasks: [O, ITask<M>][]) {
    this.tasks.unshift(...tasks);
  }

  public add(object: O, metadata?: M) {
    return new Promise<unknown>((resolve, reject) =>
      this.tasks.push([
        object,
        {
          resolve,
          reject,
          metadata,
        },
      ]),
    );
  }
}
