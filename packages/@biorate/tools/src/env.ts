'use strict';

/**
 * @description
 * globalThis polyfill
 */
export const globalThis = Function('return this')();

/**
 * @description
 * Is server or browser verification
 */
export const isServer = globalThis.window !== globalThis;
