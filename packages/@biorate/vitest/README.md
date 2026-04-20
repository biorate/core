# @biorate/vitest

OOP test decorators for Vitest with Allure support.

## Features

- **OOP Style**: Write tests using classes and decorators
- **Allure Integration**: Full support for Allure reporting
- **Clean Architecture**: Modular design with separation of concerns
- **TypeScript**: Full type safety
- **Scenario Pattern**: Support for reusable test scenarios

## Installation

```bash
pnpm add -D @biorate/vitest vitest allure-js-commons allure-vitest reflect-metadata
```

## Usage

### Basic Test

```typescript
import { suite, test, expect } from '@biorate/vitest';
import 'reflect-metadata';

@suite('My Test Suite')
class MyTest {
  @test('should pass')
  async shouldPass() {
    expect(1 + 1).toBe(2);
  }
}
```

### Allure Annotations

```typescript
import { 
  suite, 
  test, 
  epic, 
  feature, 
  story, 
  severity, 
  owner,
  label,
  tags,
  issue,
  description,
} from '@biorate/vitest';
import { Severity } from 'allure-js-commons';

@suite('Authentication')
class AuthTest {
  @epic('Security')
  @feature('Login')
  @story('User Authentication')
  @severity(Severity.CRITICAL)
  @owner('user-id-123')
  @tags('auth', 'login')
  @label('priority', 'high')
  @issue('JIRA-123', 'https://jira.example.com/JIRA-123')
  @description('Tests user login functionality')
  @test('should login user')
  async shouldLoginUser() {
    // test implementation
  }
}
```

### Lifecycle Hooks

```typescript
@suite('Database Tests')
class DatabaseTest {
  protected static async beforeAll() {
    // Setup before all tests
  }

  protected static async afterAll() {
    // Cleanup after all tests
  }

  protected async before() {
    // Setup before each test
  }

  protected async after() {
    // Cleanup after each test
  }

  @test('should connect')
  async shouldConnect() {
    // test implementation
  }
}
```

### Test Modifiers

```typescript
import { suite, test, skip, only, todo, timeout, repeats } from '@biorate/vitest';

@suite('Edge Cases')
class EdgeCasesTest {
  @skip()
  @test('skip this test')
  async skippedTest() {
    // will be skipped
  }

  @only()
  @test('run only this test')
  async exclusiveTest() {
    // only this test will run in the suite
  }

  @todo()
  @test('todo test')
  async todoTest() {
    // marked as todo
  }

  @timeout(5000)
  @test('test with timeout')
  async timeoutTest() {
    // will timeout after 5 seconds
  }

  @repeats(3, { mode: 'series' })
  @test('flaky test')
  async flakyTest() {
    // will run 3 times in series
  }
}
```

### Scenario Pattern

```typescript
import { Scenario, Step, Context } from '@biorate/vitest';

export class LoginScenario extends Scenario {
  @Step('Open login page')
  protected async openLoginPage() {
    await this.context.page.goto('/login');
  }

  @Step('Enter credentials')
  protected async enterCredentials() {
    await this.context.page.fill('#username', 'user');
    await this.context.page.fill('#password', 'pass');
  }

  @Step('Submit form')
  protected async submitForm() {
    await this.context.page.click('button[type=submit]');
  }
}

// Usage in test
@suite('Login Flow')
class LoginTest {
  @test('should login successfully')
  async testLogin() {
    await Context.run([LoginScenario], { 
      page: this.page 
    });
  }
}
```

### Suite Options

```typescript
import { suite, test } from '@biorate/vitest';

@suite('Parallel Suite', { mode: 'parallel', timeout: 10000, retries: 2 })
class ParallelTest {
  @test('test 1')
  async test1() {}

  @test('test 2')
  async test2() {}
}
```

## API Reference

### Decorators

#### Test Definition
- `@suite(name?, options?)` - Define a test suite class
- `@test(name?)` - Define a test method

#### Modifiers
- `@skip()` - Skip test/suite
- `@only()` - Run only this test/suite
- `@todo()` - Mark as TODO
- `@timeout(ms)` - Set timeout
- `@repeats(count, options)` - Repeat test

#### Allure
- `@epic(name)` - Set epic
- `@feature(name)` - Set feature
- `@story(name)` - Set story
- `@severity(level)` - Set severity
- `@owner(name)` - Set owner
- `@tag(tag)` - Add single tag
- `@tags(...tags)` - Add multiple tags
- `@label(name, value)` - Add custom label
- `@link(url, name?, type?)` - Add link
- `@id(id)` - Set test ID
- `@allureSuite(name)` - Set Allure suite
- `@parentSuite(name)` - Set parent suite
- `@subSuite(name)` - Set sub suite
- `@issue(name, url?)` - Add issue link
- `@description(value)` - Add description

## Vitest Configuration

Create `vitest.config.ts`:

```typescript
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    reporter: [
      'default',
      ['allure-vitest', { outputFolder: 'allure-results' }],
    ],
  },
});
```

## License

MIT
