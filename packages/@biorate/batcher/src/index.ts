import { injectable } from '@biorate/inversion';
import { timer } from '@biorate/tools';
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
 * const batcher: IBatcher = new Batcher<{ data: string }, { test: string }>();
 *
 * batcher.register((tasks) => {
 *   console.log(tasks);
 *   // [
 *   //   [
 *   //     { data: 'one' },
 *   //     {
 *   //       resolve: [Function (anonymous)],
 *   //       reject: [Function (anonymous)],
 *   //       metadata: { test: 'one' }
 *   //     }
 *   //   ],
 *   //   [
 *   //     { data: 'two' },
 *   //     {
 *   //       resolve: [Function (anonymous)],
 *   //       reject: [Function (anonymous)],
 *   //       metadata: { test: 'two' }
 *   //     }
 *   //   ],
 *   //   [
 *   //     { data: 'three' },
 *   //     {
 *   //       resolve: [Function (anonymous)],
 *   //       reject: [Function (anonymous)],
 *   //       metadata: { test: 'three' }
 *   //     }
 *   //   ]
 *   // ]
 * });
 * batcher.add({ data: 'one' }, { test: 'one' });
 * batcher.add({ data: 'two' }, { test: 'two' });
 * batcher.add({ data: 'three' }, { test: 'three' });
 * ```
 */
@injectable()
export class Batcher<O = unknown, M = IMetadata> implements IBatcher<O, M> {
  protected stamp = Date.now();
  protected tasks: [O, ITask<M>][] = [];
  protected callback: (tasks: [O, ITask<M>][]) => void | Promise<void>;
  protected unique = new Set<symbol | string>();

  public constructor(protected count = 100, protected timeout = 100) {
    this.loop().catch(this.panic);
  }

  public get length() {
    return this.tasks.length;
  }

  public register(callback: (tasks: [O, ITask<M>][]) => void | Promise<void>) {
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

  public async force() {
    const tasks = this.tasks.slice();
    this.tasks.length = 0;
    await this.callback(this.deduplicate(tasks));
  }

  protected panic(e: Error) {
    throw e;
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
}
