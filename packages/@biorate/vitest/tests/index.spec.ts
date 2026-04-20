import { describe, expect, it } from 'vitest';
import { Severity } from 'allure-js-commons';
import {
  suite,
  test,
  skip,
  only,
  todo,
  timeout,
  repeats,
  issue,
  severity,
  epic,
  feature,
  story,
  owner,
  label,
  tags,
  tag,
  description,
  allure,
  Context,
} from '../src';
import { Scenario1, Scenario2 } from './scenarios';

@suite('Basic Tests')
class BasicTests {
  protected static async beforeAll() {
    console.log('Before all tests');
  }

  protected static async afterAll() {
    console.log('After all tests');
  }

  protected async before() {
    console.log('Before each test');
  }

  protected async after() {
    console.log('After each test');
  }

  @issue('TEST-1', 'https://example.com/1')
  @severity(Severity.MINOR)
  @epic('Basic Epic')
  @feature('Basic Feature')
  @story('Basic Story')
  @owner('test-owner')
  @label('priority', 'low')
  @label('type', 'unit')
  @tags('basic', 'unit')
  @tag('smoke')
  @description('Basic test description')
  @test('should add numbers')
  async testAdd() {
    await allure.step('Add 1 + 1', async () => {
      expect(1 + 1).toBe(2);
    });
  }

  @skip()
  @test('should be skipped')
  async testSkip() {
    expect(true).toBe(false);
  }

  @todo()
  @test('should be todo')
  async testTodo() {
    expect(true).toBe(false);
  }

  @timeout(5000)
  @test('should timeout')
  async testTimeout() {
    await new Promise((resolve) => setTimeout(resolve, 100));
    expect(true).toBe(true);
  }

  @repeats(2)
  @test('should repeat')
  async testRepeat() {
    expect(true).toBe(true);
  }

  @issue('TEST-SCENARIO')
  @epic('Scenarios')
  @test('should run scenarios')
  async testScenarios() {
    await Context.run([Scenario1, Scenario2], {});
  }
}

@suite('Suite with Options', { mode: 'serial', timeout: 10000, retries: 2 })
class SuiteWithOptions {
  @test('test 1')
  async test1() {
    expect(1).toBe(1);
  }

  @test('test 2')
  async test2() {
    expect(2).toBe(2);
  }
}
