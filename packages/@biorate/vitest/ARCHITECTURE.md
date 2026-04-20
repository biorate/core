# Vitest OOP Package Architecture

## Overview

This package provides OOP-style test decorators for Vitest with full Allure integration, inspired by the Playwright implementation but with significant improvements in architecture and code quality.

## Key Improvements Over Playwright Implementation

### 1. **Cleaner Code Structure**

**Playwright Issues:**
- Mixed responsibilities in single file (341 lines in playwright.ts)
- Complex nested functions
- Inconsistent formatting

**Vitest Solution:**
- Modular architecture with separate files for each concern
- Clear separation: symbols, utils, context, scenario, vitest core
- Each file has a single responsibility

### 2. **Better Type Safety**

**Playwright Issues:**
- Heavy use of `any` types
- Complex type inference for TestArgs

**Vitest Solution:**
- Leverages Vitest's native `TestContext` type
- Clean `TestArgs` interface extending `TestContext`
- Better IDE autocomplete support

### 3. **Simplified Architecture**

**Playwright Issues:**
- Complex wrapping functions (`wrapEach`, `wrapAll`)
- Special handling for different hook types

**Vitest Solution:**
- Single `wrapHook` utility function
- Consistent hook handling
- Reduced code duplication

### 4. **Enhanced Features**

**New Features in Vitest:**
- `@todo()` decorator for TODO tests
- `@timeout()` decorator for per-test timeout
- `@repeats()` decorator for test repetition
- Suite options via `@suite(name, options)`
- Better error messages

### 5. **Improved Allure Integration**

**Playwright Issues:**
- Complex metadata handling
- Verbose decorator implementations

**Vitest Solution:**
- Cleaner `#setAllureMethod` implementation
- Consistent decorator pattern
- Better support for multiple annotations

## File Structure

```
packages/@biorate/vitest/
├── src/
│   ├── index.ts           # Main exports
│   ├── symbols.ts         # Metadata keys (clean, single responsibility)
│   ├── interfaces.ts      # TypeScript interfaces
│   ├── utils.ts           # Utility functions (wrapHook)
│   ├── context.ts         # Context management with Allure steps
│   ├── scenario.ts        # Scenario pattern implementation
│   └── vitest.ts          # Core OOP decorators
├── tests/
│   ├── index.spec.ts      # Example tests
│   └── scenarios/         # Example scenarios
│       ├── index.ts
│       ├── scenario1.ts
│       └── scenario2.ts
├── package.json
├── tsconfig.json
├── tsconfig.build.json
├── vitest.config.ts
├── README.md
└── CHANGELOG.md
```

## Usage Examples

### Basic Test

```typescript
import { suite, test } from '@biorate/vitest';
import 'reflect-metadata';

@suite('My Suite')
class MyTest {
  @test('should work')
  async shouldWork() {
    // test implementation
  }
}
```

### Allure Annotations

```typescript
import { 
  suite, test, epic, feature, story, 
  severity, owner, tags, label, issue 
} from '@biorate/vitest';
import { Severity } from 'allure-js-commons';

@suite('Authentication')
class AuthTest {
  @epic('Security')
  @feature('Login')
  @story('User Login')
  @severity(Severity.CRITICAL)
  @owner('user-123')
  @tags('auth', 'login', 'critical')
  @label('priority', 'P0')
  @issue('JIRA-123', 'https://jira.example.com/123')
  @test('should authenticate user')
  async shouldAuthenticate() {
    // test implementation
  }
}
```

### Scenario Pattern

```typescript
import { Scenario, Step, Context } from '@biorate/vitest';

export class LoginScenario extends Scenario {
  @Step('Open login page')
  protected async openPage() {
    // step implementation
  }

  @Step('Enter credentials')
  protected async enterCredentials() {
    // step implementation
  }
}

@suite('Login Tests')
class LoginTest {
  @test('should login')
  async testLogin() {
    await Context.run([LoginScenario], { /* context */ });
  }
}
```

### Test Modifiers

```typescript
import { suite, test, skip, only, todo, timeout, repeats } from '@biorate/vitest';

@suite('Edge Cases')
class EdgeTests {
  @skip()
  @test('skip this')
  async skipped() {}

  @only()
  @test('run only this')
  async exclusive() {}

  @todo()
  @test('todo')
  async todoTest() {}

  @timeout(5000)
  @test('with timeout')
  async timeoutTest() {}

  @repeats(3, { mode: 'series' })
  @test('flaky')
  async flakyTest() {}
}
```

## Technical Details

### Metadata Keys

Defined in `symbols.ts` using `@biorate/symbolic`:
- `Test`, `Skip`, `Only`, `Todo`
- `Suite`, `Timeout`, `Repeats`
- `Allure`, `Scenario`

### Decorator Implementation

All decorators use the standard TypeScript decorator pattern:
```typescript
#test = (name?: string) => (
  target: any, 
  propertyKey: string, 
  descriptor: PropertyDescriptor
) => Reflect.defineMetadata(Test, { name }, target);
```

### Allure Integration

Allure methods are collected via metadata and applied during test execution:
```typescript
for (const method in allureMethods) {
  if (method in allure) {
    const allureFn = (allure as any)[method];
    await allureFn(...allureMethods[method]);
  }
}
```

### Context Management

Extends `@biorate/run-context` for scenario execution:
```typescript
export class Context extends ContextCommon {
  protected static metaKey = ScenarioSymbol;
  
  protected static async runStep(step: () => void | Promise<void>) {
    const meta = Reflect.getMetadata(this.metaKey, step);
    await allure.step(
      (meta?.name ?? step?.name?.replace('bound ', '') || 'unknown'),
      async () => await step()
    );
  }
}
```

## Dependencies

### Peer Dependencies
- `vitest` >= 2.0.0
- `allure-js-commons` >= 3.2.0
- `allure-vitest` >= 3.2.0
- `reflect-metadata` >= 0.1.13

### Workspace Dependencies
- `@biorate/run-context` - Context management
- `@biorate/symbolic` - Symbol creation
- `@biorate/tools` - Utility functions

## Best Practices

1. **Use descriptive test names**: `@test('should authenticate valid user')`
2. **Add Allure annotations**: Helps with reporting and traceability
3. **Keep scenarios focused**: One responsibility per scenario class
4. **Use lifecycle hooks**: For setup/teardown logic
5. **Leverage modifiers**: Use `@skip()`, `@timeout()` appropriately

## Migration from Playwright

If you're migrating from `@biorate/playwright`:

1. Replace imports:
   ```typescript
   // Before
   import { suite, test } from '@biorate/playwright';
   
   // After
   import { suite, test } from '@biorate/vitest';
   ```

2. Update hooks:
   ```typescript
   // Playwright
   protected async before() {}
   protected async after() {}
   
   // Vitest (same API)
   protected async before() {}
   protected async after() {}
   ```

3. Update context access:
   ```typescript
   // Playwright
   @test('test')
   async myTest({ page }: TestArgs) {}
   
   // Vitest
   @test('test')
   async myTest(context: TestContext) {
     const page = context.page;
   }
   ```

## Future Enhancements

- [ ] Support for Vitest fixtures
- [ ] Enhanced parallel execution
- [ ] Test data management
- [ ] Enhanced reporting integration
- [ ] Snapshot testing helpers

## License

MIT
