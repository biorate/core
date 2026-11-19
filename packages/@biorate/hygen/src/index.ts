/**
 * @description Programmatic runner entry point
 * */
export { runner } from './runner';
/**
 * @description Validation and render&rarr;execute pipeline
 * */
export { engine } from './engine';
/**
 * @description Runner configuration resolver
 * */
export { default as resolve } from './config-resolver';
/**
 * @description CLI help printer, available-actions listing and package version
 * */
export { printHelp, availableActions, VERSION } from './help';
/**
 * @description Default `Logger` implementation
 * */
export { default as Logger } from './logger';
/**
 * @description Error classes exports
 * */
export * as errors from './errors';
/**
 * @description Declarative action parameter schema types
 * */
export type {
  ParamDescriptor,
  ParamType,
  ParamsSchema,
  ProjectConfig,
  RunnerContextConfig,
} from './types';
/**
 * @description Abstract base class for class-based project configurations
 * (`.hygen.*` default export) — hooks as prototype methods, helpers as
 * property/getter/factory, constructor-initialized fields.
 * */
export { HygenConfig } from './hygen-config';
