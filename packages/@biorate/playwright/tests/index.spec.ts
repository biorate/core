import * as chai from 'chai';
import { Severity } from 'allure-js-commons';
import {
  suite,
  test,
  slow,
  issue,
  severity,
  epic,
  feature,
  story,
  owner,
  tag,
  tags,
  label,
  expect,
  Page,
  Context,
  allure,
  extend,
} from '../src';
import { Scenario1, Scenario2 } from './scenarios';
import { TestArgs } from '../interfaces';

@suite('Test123')
class Test {
  protected static async before() {
    console.log('beforeAll');
  }

  protected static async after() {
    // console.log('afterAll');
  }

  protected async before() {
    // console.log('beforeEach');
  }

  protected async after() {
    // console.log('afterEach');
  }

  @issue('1', 'http://google.com')
  @severity(Severity.MINOR)
  @epic('Epic allure test')
  @feature('Feature allure test')
  @story('Story allure test')
  @owner('60000000')
  @label('label1', 'description1')
  @label('label2', 'description2')
  @tags('tag2', 'tag1')
  @test('test1')
  protected async test1({ page }: TestArgs) {
    await allure.step('playwright.dev', async () => {
      await page.goto('https://playwright.dev/');
      await page.goto('https://playwright.dev/');
      await expect(page).toHaveTitle(/Playwright/);
    });
  }

  @issue('2')
  @severity(Severity.MINOR)
  @epic('Epic allure test2')
  @feature('Feature allure test2')
  @story('Story allure test2')
  @owner('60000000')
  @tag('api')
  @test('test2')
  protected async test2({ page }: TestArgs) {
    await page.goto('https://playwright.dev/');
    await expect(page).toHaveTitle(/Playwright/);
  }

  @issue('3')
  @severity(Severity.MINOR)
  @epic('Epic allure test3')
  @feature('Feature allure test3')
  @story('Story allure test3')
  @owner('60000000')
  @tag('api')
  @extend({ extra: 'hello world!' })
  @test('test3')
  protected async test3({ page, extra }: TestArgs & { extra: string }) {
    chai.expect(extra).to.be.eq('hello world!');
    await Context.run([Scenario1, Scenario2], { page });
  }
}
