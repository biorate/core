'use strict';
const globalThis = Function('return this')();

export const isServer = globalThis.window !== globalThis;
