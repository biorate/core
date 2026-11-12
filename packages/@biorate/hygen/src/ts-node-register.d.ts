/**
 * @description Ambient declaration for the `ts-node` register entry that is
 * lazily imported for on-the-fly transpilation of `.ts` config files. Its only
 * purpose is the side effect of installing the transpile-only hook, so the
 * module carries no meaningful API surface (no `@types/ts-node` ships one).
 * */
declare module 'ts-node/register/transpile-only';
