/**
 * @description
 * OOP test decorators for Playwright with Allure integration.
 *
 * @example
 * ```ts
 * import { suite, test, epic, severity, TestArgs } from '@biorate/playwright';
 * import { Severity } from 'allure-js-commons';
 *
 * @suite('My Suite')
 * class MyTest {
 *   @epic('My Epic')
 *   @severity(Severity.CRITICAL)
 *   @test('should work')
 *   async shouldWork({ page }: TestArgs) {
 *     await page.goto('https://example.com');
 *   }
 * }
 * ```
 */
import 'reflect-metadata';
import './runtime';
export * from './playwright';
export * from './context';
export * from './scenario';
