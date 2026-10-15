# Playwright

OOP test decorators for Playwright with Allure integration.

### Features

- OOP-style tests with `@suite` / `@test` decorators
- Full Allure reporting support (`@epic`, `@feature`, `@story`, `@severity`, etc.)
- Scenario pattern — run `Scenario` classes via `@biorate/run-context`'s `Context.run` (see notes below on `@Step`)
- Test modifiers: `@skip`, `@only`, `@slow`
- Fixture extension via `@extend`

### Peer dependencies

```bash
pnpm add -D @playwright/test playwright allure-js-commons allure-playwright reflect-metadata
```

`@biorate/playwright` declares `@playwright/test`, `playwright`, `allure-js-commons`, `allure-playwright` and `reflect-metadata` as peer dependencies.

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
```

### Suite-level hooks

Lifecycle hooks are named `before` and `after`. The library reads the **static** `before` / `after` for suite-level hooks and the **instance** `before` / `after` for per-test hooks.

```ts
@suite('With Hooks')
class HooksTest {
  // suite-level hook: registered as test.beforeAll
  protected static async before({ browser, browserName, request }: TestArgs) {}

  // per-test hook: registered as test.beforeEach
  protected async before({ page }: TestArgs) {}

  // per-test hook: registered as test.afterEach
  protected async after({ page }: TestArgs) {}

  @test('test')
  async test({ page }: TestArgs) {}
}
```

Known issue: the static `after` hook is **not** registered as an `afterAll`. The implementation registers both static `before` and static `after` as `beforeAll` hooks, so the static `after` runs _before_ the tests. A static `afterAll` method is never invoked. The static `after` hook is also only registered when a static `before` hook is present (the guard checks `Class.before`). If you need a run-after-all hook, it is not supported reliably by this version.

### Scenario pattern

```ts
import { Scenario } from '@biorate/playwright'; // provides this.page
import { Context, step } from '@biorate/run-context';

class LoginScenario extends Scenario {
  @step('Open login page')
  async open() {
    await this.page.goto('/login');
  }

  @step('Submit form')
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

Known issue: the `@Step` decorator exported by `@biorate/playwright` currently does **not** register steps with `Context.run` — its metadata is attached to the prototype while `Context.run` reads it from the method descriptor, so no steps are executed. Use the `step` decorator from `@biorate/run-context` (as shown above), which is the working pattern.

### Learn

- Documentation can be found here - [docs](https://biorate.github.io/core/modules/playwright.html).

### Release History

See the [CHANGELOG](https://github.com/biorate/core/blob/master/packages/%40biorate/playwright/CHANGELOG.md)

### License

[MIT](https://github.com/biorate/core/blob/master/packages/%40biorate/playwright/LICENSE)

Copyright (c) 2021-present [Leonid Levkin (llevkin)](mailto:llevkin@yandex.ru)
