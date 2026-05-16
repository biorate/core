import { expect } from 'vitest';
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
  Allure as AllureSymbol,
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
    const ctx = await Context.run([Scenario1, Scenario2], {});
    expect(ctx.all()).toEqual({
      'step0-Scenario1': true,
      'step1-Scenario1': true,
      'step2-Scenario1': true,
      'step1-Scenario2': true,
      'step2-Scenario2': true,
    });
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

@epic('ClassLevelEpic')
@feature('ClassLevelFeature')
@story('ClassLevelStory')
@owner('class-owner')
@severity(Severity.NORMAL)
@tag('class-tag')
@tags('class-tags')
@description('Class level description')
@suite('Class Level Allure Decorators')
class ClassLevelAllureTest {
  @test('inherits class-level allure metadata')
  async testClassLevel() {
    const proto = Object.getPrototypeOf(this);
    const meta = Reflect.getMetadata(AllureSymbol, proto);
    expect(meta).toBeDefined();
    expect(meta.epic).toEqual(['ClassLevelEpic']);
    expect(meta.feature).toEqual(['ClassLevelFeature']);
    expect(meta.story).toEqual(['ClassLevelStory']);
    expect(meta.owner).toEqual(['class-owner']);
    expect(meta.severity).toEqual([Severity.NORMAL]);
    expect(meta.tag).toEqual([['class-tag']]);
    expect(meta.tags).toEqual(['class-tags']);
    expect(meta.description).toEqual(['Class level description']);
  }

  @test('class-level tag accumulates')
  async testClassLevelTags() {
    const proto = Object.getPrototypeOf(this);
    const meta = Reflect.getMetadata(AllureSymbol, proto);
    expect(meta.tag).toEqual([['class-tag']]);
  }

  @test('class-level metadata is available on instance')
  async testViaInstance() {
    const meta = Reflect.getMetadata(AllureSymbol, this);
    // Instance inherits from prototype via reflect-metadata chain
    expect(meta).toBeDefined();
    expect(meta.epic).toEqual(['ClassLevelEpic']);
    expect(meta.feature).toEqual(['ClassLevelFeature']);
  }
}

@epic('BaseEpic')
@feature('BaseFeature')
@owner('base-owner')
@suite('Method Priority Over Class')
class MethodPriorityTest {
  @epic('MethodEpic')
  @feature('MethodFeature')
  @owner('method-owner')
  @test('method-level overrides class-level')
  async testOverride() {
    const descriptor = Object.getOwnPropertyDescriptor(
      MethodPriorityTest.prototype,
      'testOverride',
    );
    const methodMeta = Reflect.getMetadata(AllureSymbol, descriptor!.value);
    expect(methodMeta.epic).toEqual(['MethodEpic']);
    expect(methodMeta.feature).toEqual(['MethodFeature']);
    expect(methodMeta.owner).toEqual(['method-owner']);
  }

  @tag('method-tag')
  @test('method appends append-mode decorators')
  async testAppendPriority() {
    const descriptor = Object.getOwnPropertyDescriptor(
      MethodPriorityTest.prototype,
      'testAppendPriority',
    );
    const methodMeta = Reflect.getMetadata(AllureSymbol, descriptor!.value);
    expect(methodMeta.tag).toEqual([['method-tag']]);
  }

  @test('inherits class-level where method has no decorator')
  async testInheritsClassLevel() {
    const proto = Object.getPrototypeOf(this);
    const classMeta = Reflect.getMetadata(AllureSymbol, proto);
    expect(classMeta.epic).toEqual(['BaseEpic']);
    expect(classMeta.feature).toEqual(['BaseFeature']);
    expect(classMeta.owner).toEqual(['base-owner']);
  }

  @test('method wins when both class and method define same key')
  async testMergeOrder() {
    const proto = Object.getPrototypeOf(this);
    const descriptor = Object.getOwnPropertyDescriptor(
      MethodPriorityTest.prototype,
      'testMergeOrder',
    );
    const classMeta = Reflect.getMetadata(AllureSymbol, proto);
    const methodMeta = Reflect.getMetadata(AllureSymbol, descriptor!.value);
    const merged = { ...classMeta, ...methodMeta };
    expect(merged.epic).toEqual(['BaseEpic']);
    expect(merged.feature).toEqual(['BaseFeature']);
    expect(merged.owner).toEqual(['base-owner']);
    expect(1).toBe(1);
  }
}
