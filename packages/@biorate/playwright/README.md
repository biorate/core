# Playwright

OOP test decorators for Playwright with Allure integration.

### Features

- OOP-style tests with `@suite` / `@test` decorators
- Full Allure reporting support (`@epic`, `@feature`, `@story`, `@severity`, etc.)
- Scenario pattern with `@Step` decorator
- Test modifiers: `@skip`, `@only`, `@slow`
- Fixture extension via `@extend`

### Examples:

```ts
import { suite, test, epic, severity, TestArgs } from '@biorate/playwright';
import { Severity } from 'allure-js-commons';

// Basic test
@suite('My Suite')
class MyTest {
  @test('should work')
  async shouldWork({ page }: TestArgs) {
    await page.goto('https://example.com');
  }
}

// With Allure annotations
@suite('Login')
class LoginTest {
  @epic('Auth')
  @feature('Login')
  @severity(Severity.CRITICAL)
  @test('should login')
  async shouldLogin({ page }: TestArgs) {
    await page.goto('/login');
    await page.fill('#username', 'user');
    await page.fill('#password', 'pass');
    await page.click('button[type=submit]');
  }
}

// Suite-level hooks
@suite('With Hooks')
class HooksTest {
  protected static async beforeAll({ browser }: TestArgs) {
    // runs once before all tests
  }

  protected async before({ page }: TestArgs) {
    // runs before each test
  }

  protected async after({ page }: TestArgs) {
    // runs after each test
  }

  protected static async afterAll({ browser }: TestArgs) {
    // runs once after all tests
  }

  @test('test')
  async test({ page }: TestArgs) {}
}

// Scenario pattern
import { Scenario, Step, Context } from '@biorate/playwright';

class LoginScenario extends Scenario {
  @Step('Open login page')
  async open() {
    await this.page.goto('/login');
  }

  @Step('Submit form')
  async submit() {
    await this.page.fill('#username', 'user');
    await this.page.click('button[type=submit]');
  }
}

@suite('Scenario')
class ScenarioTest {
  @test('run scenario')
  async runScenario({ page }: TestArgs) {
    await Context.run([LoginScenario], { page });
  }
}
```

### Learn

- Documentation can be found here - [docs](https://biorate.github.io/core/modules/playwright.html).

### Release History

See the [CHANGELOG](https://github.com/biorate/core/blob/master/packages/%40biorate/playwright/CHANGELOG.md)

### License

[MIT](https://github.com/biorate/core/blob/master/packages/%40biorate/playwright/LICENSE)

Copyright (c) 2021-present [Leonid Levkin (llevkin)](mailto:llevkin@yandex.ru)
