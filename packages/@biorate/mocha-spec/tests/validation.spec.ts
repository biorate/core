import { suite, test } from '@biorate/mocha';
import { isBoolean } from 'class-validator';
import { Spec, TestSchema } from './__mocks__';

@suite('@biorate/mocha-spec - validation')
class MochaValidationSpec extends Spec {
  @test('object-positive')
  protected async objectPositive() {
    await this.validate({
      schema: TestSchema,
      data: { number: 1, string: 'test', boolean: false },
    });
  }

  @test('object-negative')
  protected async objectNegative() {
    await this.validate({
      schema: TestSchema,
      data: { number: '1', string: 'test', boolean: false },
      catch: (e: Error) => true,
    });
  }

  @test('array-object-positive')
  protected async arrayObjectPositive() {
    await this.validate({
      schema: TestSchema,
      data: [
        { number: 1, string: 'foo', boolean: false },
        { number: 2, string: 'bar', boolean: true },
      ],
      array: true,
    });
  }

  @test('array-object-negative')
  protected async arrayObjectNegative() {
    await this.validate({
      schema: TestSchema,
      data: [
        { number: 1, string: 'foo', boolean: false },
        { number: 2, string: 'bar', boolean: 'true' },
      ],
      array: true,
      catch: (e: Error) => true,
    });
  }

  @test('primitive-positive')
  protected async primitivePositive() {
    await this.validate({
      schema: isBoolean,
      data: true,
    });
  }

  @test('primitive-negative')
  protected async primitiveNegative() {
    await this.validate({
      schema: isBoolean,
      data: 'true',
      catch: (e: Error) => true,
    });
  }

  @test('array-primitive-positive')
  protected async arrayPrimitivePositive() {
    await this.validate({
      schema: isBoolean,
      data: [true, false, true, false],
      array: true,
    });
  }

  @test('array-primitive-negative')
  protected async arrayPrimitiveNegative() {
    await this.validate({
      schema: isBoolean,
      data: [true, false, 'true', false],
      array: true,
      catch: (e: Error) => true,
    });
  }
}
