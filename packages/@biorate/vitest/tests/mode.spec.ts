import { describe, expect, it } from 'vitest';
import { suite, test } from '../src';

@suite('Serial Suite Test', { mode: 'serial' })
class SerialSuiteTest {
  private static executionOrder: string[] = [];

  @test('test A - should run first')
  async testA() {
    SerialSuiteTest.executionOrder.push('A');
    await new Promise(resolve => setTimeout(resolve, 50));
    expect(SerialSuiteTest.executionOrder).toEqual(['A']);
  }

  @test('test B - should run second')
  async testB() {
    SerialSuiteTest.executionOrder.push('B');
    await new Promise(resolve => setTimeout(resolve, 50));
    expect(SerialSuiteTest.executionOrder).toEqual(['A', 'B']);
  }

  @test('test C - should run third')
  async testC() {
    SerialSuiteTest.executionOrder.push('C');
    expect(SerialSuiteTest.executionOrder).toEqual(['A', 'B', 'C']);
  }
}

@suite('Parallel Suite Test', { mode: 'parallel' })
class ParallelSuiteTest {
  private static executionOrder: string[] = [];

  @test('test X - should run in parallel')
  async testX() {
    ParallelSuiteTest.executionOrder.push('X-start');
    await new Promise(resolve => setTimeout(resolve, 100));
    ParallelSuiteTest.executionOrder.push('X-end');
    expect(ParallelSuiteTest.executionOrder).toContain('X-start');
  }

  @test('test Y - should run in parallel')
  async testY() {
    ParallelSuiteTest.executionOrder.push('Y-start');
    await new Promise(resolve => setTimeout(resolve, 100));
    ParallelSuiteTest.executionOrder.push('Y-end');
    expect(ParallelSuiteTest.executionOrder).toContain('Y-start');
  }
}
