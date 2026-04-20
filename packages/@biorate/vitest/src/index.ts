/**
 * OOP test decorators for Vitest with Allure support
 *
 * @remarks
 * Features:
 * - Class-based test definition with decorators
 * - Full Allure reporting integration
 * - Scenario pattern for reusable test steps
 * - Test lifecycle hooks (beforeAll, afterAll, before, after)
 * - Test modifiers (skip, only, todo, timeout, repeats)
 * - Suite options (mode, timeout, retries)
 * - TypeScript support with full type safety
 *
 * @example
 * ```typescript
 * import { suite, test, epic, severity, owner, tags } from '@biorate/vitest';
 * import { Severity } from 'allure-js-commons';
 * import 'reflect-metadata';
 *
 * @suite('Authentication')
 * class AuthTest {
 *   @epic('Security')
 *   @feature('Login')
 *   @story('User Authentication')
 *   @severity(Severity.CRITICAL)
 *   @owner('user-id-123')
 *   @tags('auth', 'login', 'critical')
 *   @test('should authenticate user')
 *   async shouldAuthenticate() {
 *     // test implementation
 *   }
 * }
 * ```
 *
 * @example
 * ```typescript
 * import { suite, test, skip, only, todo, timeout, repeats } from '@biorate/vitest';
 *
 * @suite('Edge Cases')
 * class EdgeCasesTest {
 *   @skip()
 *   @test('skip this test')
 *   async skippedTest() {
 *     // will be skipped
 *   }
 *
 *   @only()
 *   @test('run only this test')
 *   async exclusiveTest() {
 *     // only this test will run
 *   }
 *
 *   @todo()
 *   @test('todo test')
 *   async todoTest() {
 *     // marked as todo
 *   }
 *
 *   @timeout(5000)
 *   @test('test with timeout')
 *   async timeoutTest() {
 *     // will timeout after 5 seconds
 *   }
 *
 *   @repeats(3, { mode: 'series' })
 *   @test('flaky test')
 *   async flakyTest() {
 *     // will run 3 times in series
 *   }
 * }
 * ```
 *
 * @example
 * ```typescript
 * import { Scenario, Step, Context } from '@biorate/vitest';
 *
 * export class LoginScenario extends Scenario {
 *   @Step('Open login page')
 *   protected async openPage() {
 *     await this.context.page.goto('/login');
 *   }
 *
 *   @Step('Enter credentials')
 *   protected async enterCredentials() {
 *     await this.context.page.fill('#username', 'user');
 *     await this.context.page.fill('#password', 'pass');
 *   }
 * }
 *
 * @suite('Login Flow')
 * class LoginTest {
 *   @test('should login successfully')
 *   async testLogin() {
 *     await Context.run([LoginScenario], { page: this.page });
 *   }
 * }
 * ```
 *
 * @example
 * ```typescript
 * import { suite, test } from '@biorate/vitest';
 *
 * @suite('Database Tests')
 * class DatabaseTest {
 *   protected static async beforeAll() {
 *     // Setup before all tests
 *   }
 *
 *   protected static async afterAll() {
 *     // Cleanup after all tests
 *   }
 *
 *   protected async before() {
 *     // Setup before each test
 *   }
 *
 *   protected async after() {
 *     // Cleanup after each test
 *   }
 *
 *   @test('should connect')
 *   async shouldConnect() {
 *     // test implementation
 *   }
 * }
 * ```
 */
export * from './interfaces';
export * from './symbols';
export { Context } from './context';
export { Scenario, Step } from './scenario';
export {
  suite,
  test,
  skip,
  only,
  todo,
  timeout,
  repeats,
  label,
  link,
  id,
  epic,
  feature,
  story,
  allureSuite,
  parentSuite,
  subSuite,
  owner,
  severity,
  tag,
  tags,
  description,
  issue,
  Vitest,
} from './vitest';
export * as allure from 'allure-js-commons';
