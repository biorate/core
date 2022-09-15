import { EventEmitter } from 'events';

/**
 * @description
 * Wait event once asynchronous
 * @param object - Event object
 * @param event - event name
 * @example
 * ```ts
 *   import { events } from '@biorate/tools';
 *
 *   (async () => {
 *     const object = new EventEmitter();
 *     const promise = events.once(object, 'test');
 *     object.emit('test', 1, 2, 3);
 *     const data = await promise;
 *     console.log(data); [1, 2, 3]
 *   })();
 * ```
 */
export const once = (object: EventEmitter, event: string) =>
  new Promise((resolve) => object.once(event, (...args: unknown[]) => resolve(args)));
