import { suite, test } from '@biorate/mocha';
import { Spec, unitTests, TestSchema } from './__mocks__';

@suite('@biorate/mocha-spec')
class MochaSpec extends Spec {
  @test('unit-positive')
  protected async unitPositive() {
    await this.unit({
      context: unitTests,
      method: 'test',
      args: [3],
      expects: {
        context: true,
        args: true,
        return: true,
      },
    });
  }

  @test('unit-negative')
  protected async unitNegative() {
    await this.unit({
      context: unitTests,
      method: 'throw',
      args: [],
      expects: {
        context: true,
        args: true,
        return: true,
      },
      catch: (e: Error) => e.message.includes('Test error'),
    });
  }

  @test('validation-positive')
  protected async validationPositive() {
    await this.validate({
      schema: TestSchema,
      data: { number: 1, string: 'test', boolean: false },
    });
  }

  @test('validation-negative')
  protected async validationNegative() {
    await this.validate({
      schema: TestSchema,
      data: { number: '1', string: 'test', boolean: false },
      catch: (e: Error) => true,
    });
  }
}
