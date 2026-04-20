import { create } from '@biorate/symbolic';

/**
 * Create symbol namespace for Vitest decorators
 * Each symbol is used as a metadata key for decorator data
 */
const Symbols = create('Vitest');

/**
 * Test method metadata key
 */
export const Test = Symbols.Test;

/**
 * Skip decorator metadata key
 */
export const Skip = Symbols.Skip;

/**
 * Only decorator metadata key
 */
export const Only = Symbols.Only;

/**
 * Todo decorator metadata key
 */
export const Todo = Symbols.Todo;

/**
 * Suite metadata key
 */
export const Suite = Symbols.Suite;

/**
 * Allure metadata key
 */
export const Allure = Symbols.Allure;

/**
 * Scenario metadata key
 */
export const Scenario = Symbols.Scenario;

/**
 * Timeout metadata key
 */
export const Timeout = Symbols.Timeout;

/**
 * Repeats metadata key
 */
export const Repeats = Symbols.Repeats;

/**
 * Extend context metadata key
 */
export const Extends = Symbols.Extends;
