import { expect } from 'vitest';
import {
  suite,
  test,
  retries,
  parallel,
  slow,
  pending,
  params,
  context,
  allureStep,
  attachment,
  testCaseId,
  data,
  decorate,
  assignPmsUrl,
  assignTmsUrl,
} from '../src';

/**
 * Test class for deprecated Mocha compatibility decorators
 * These decorators are provided for smooth migration from @biorate/mocha to @biorate/vitest
 */
@suite('Deprecated Decorators Compatibility')
@parallel(true)
class DeprecatedDecoratorsTest {
  /**
   * Test with @retries decorator (deprecated, use @repeats instead)
   */
  @retries(2)
  @test('should work with retries decorator')
  async testRetries() {
    expect(true).toBe(true);
  }

  /**
   * Test with @slow decorator (deprecated, use @timeout instead)
   */
  @slow(1000)
  @test('should work with slow decorator')
  async testSlow() {
    expect(true).toBe(true);
  }

  /**
   * Test with @pending decorator (deprecated, use @skip or @todo instead)
   */
  @pending()
  @test('should be pending with pending decorator')
  async testPending() {
    expect(true).toBe(false); // This should not run
  }

  /**
   * Test with @params decorator (deprecated, params handled differently in Vitest)
   */
  @params([1, 2, 3], [2, 3, 5], [3, 4, 7])
  @test('should work with params decorator')
  async testParams() {
    // Note: In Vitest, parameterized tests work differently
    // This decorator stores metadata but doesn't auto-generate tests
    expect(true).toBe(true);
  }

  /**
   * Test with @allureStep decorator (deprecated, use allure.step() directly)
   */
  @allureStep('Test step')
  @test('should work with allureStep decorator')
  async testAllureStep() {
    expect(true).toBe(true);
  }

  /**
   * Test with @attachment decorator (deprecated, use allure.attachment() directly)
   */
  @attachment('Test Attachment', 'Test content', 'text/plain')
  @test('should work with attachment decorator')
  async testAttachment() {
    expect(true).toBe(true);
  }

  /**
   * Test with @testCaseId decorator (deprecated, use @id instead)
   */
  @testCaseId('TEST-123')
  @test('should work with testCaseId decorator')
  async testTestCaseId() {
    expect(true).toBe(true);
  }

  /**
   * Test with @data decorator (deprecated, use Vitest's native parameterized tests)
   */
  @data([1, 2, 3], 'test case 1')
  @test('should work with data decorator')
  async testData() {
    expect(true).toBe(true);
  }
}

/**
 * Combined test with multiple deprecated decorators
 */
@suite('Combined Deprecated Test', { timeout: 5000 })
@parallel(true)
class CombinedDeprecatedTest {
  @retries(1)
  @slow(2000)
  @test('should work with multiple deprecated decorators')
  async testCombined() {
    expect(true).toBe(true);
  }
}

/**
 * Test for deprecated functions
 */
@suite('Deprecated Functions Test')
class DeprecatedFunctionsTest {
  @test('should work with context symbol')
  async testContext() {
    // context is a symbol, just check it exists
    expect(context).toBeDefined();
    expect(typeof context).toBe('symbol');
  }

  @test('should work with decorate function')
  async testDecorate() {
    // decorate is a no-op for compatibility
    decorate({});
    expect(true).toBe(true);
  }

  @test('should work with assignPmsUrl function')
  async testAssignPmsUrl() {
    assignPmsUrl('https://pms.example.com');
    expect(process.env.PMS_URL).toBe('https://pms.example.com');
  }

  @test('should work with assignTmsUrl function')
  async testAssignTmsUrl() {
    assignTmsUrl('https://tms.example.com');
    expect(process.env.TMS_URL).toBe('https://tms.example.com');
  }
}
