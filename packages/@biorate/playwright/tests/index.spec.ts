import { Severity } from 'allure-js-commons';
import {
  suite,
  test,
  issue,
  severity,
  epic,
  feature,
  story,
  owner,
  tag,
  Page,
  expect,
  Context,
} from '../src';
import { Scenario1, Scenario2 } from './scenarios';

@suite('Test123')
class Test {
  @issue('1')
  @severity(Severity.MINOR)
  @epic('Epic allure test')
  @feature('Feature allure test')
  @story('Story allure test')
  @owner('60000000')
  @tag('tag')
  @test('test1')
  protected async test1({ page }: { page: Page }) {
    await page.goto('https://playwright.dev/');
    await expect(page).toHaveTitle(/Playwright/);
  }

  @issue('2')
  @severity(Severity.MINOR)
  @epic('Epic allure test2')
  @feature('Feature allure test2')
  @story('Story allure test2')
  @owner('60000000')
  @tag('api')
  @test('test2')
  protected async test2({ page }: { page: Page }) {
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
  @test('test3')
  protected async test3({ page }: { page: Page }) {
    await Context.run([Scenario1, Scenario2], { page });
  }
}
