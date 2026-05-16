# Vitest spec

Vitest Spec abstract helper class

# Reason

- For tests lightweight

# Feature

- Unit tests automatization
- Data validation with class-validator

### Examples:

```ts
import { suite, test } from '@biorate/vitest';
import { IsNumber, IsString, IsBoolean } from 'class-validator';
import { Spec } from '@biorate/vitest-spec';

// Extend Spec to get access to helpers
class MySpec extends Spec {
  protected get httpServer() {
    return app; // Express / NestJS app
  }
}

// API testing with validation
@suite('API')
class ApiTest extends MySpec {
  @test('POST /')
  async 'POST /'() {
    class Response {
      @IsNumber() public b: number;
      @IsString() public c: string;
      @IsBoolean() public d: boolean;
    }
    await this.api('/api')
      .post('/')
      .send({ b: 1 })
      .expect(200)
      .then(validate(Response))
      .then(exactly({ b: 1, c: 'test', d: false }));
  }
}

// Unit-testing with snapshot matching
@suite('Unit', { mode: 'serial' })
class UnitTest extends MySpec {
  @test('all-expects-positive')
  async allExpectsPositive() {
    const ctx = new MyService();
    await this.unit({
      context: ctx,
      method: 'increment',
      args: [3],
      expects: { context: true, args: true, return: true },
    });
  }
}

// Data validation
@suite('Validation')
class ValidationTest extends MySpec {
  @test('object-positive')
  async objectPositive() {
    await this.validate({
      schema: MySchema,
      data: { number: 1, string: 'test', boolean: false },
    });
  }

  @test('primitive-positive')
  async primitivePositive() {
    await this.validate({
      schema: isBoolean,
      data: true,
    });
  }
}

// exactly helper
@suite('Exactly')
class ExactlyTest extends MySpec {
  @test('deep equality')
  async 'deep equality'() {
    this.exactly({ a: 1 }, { a: 1 });
  }
}
```

### Learn

- Documentation can be found here - [docs](https://biorate.github.io/core/modules/vitest_spec.html).

### Release History

See the [CHANGELOG](https://github.com/biorate/core/blob/master/packages/%40biorate/vitest-spec/CHANGELOG.md)

### License

[MIT](https://github.com/biorate/core/blob/master/packages/%40biorate/vitest-spec/LICENSE)

Copyright (c) 2021-present [Leonid Levkin (llevkin)](mailto:llevkin@yandex.ru)
