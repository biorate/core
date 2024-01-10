import { suite, test } from '@biorate/mocha';
import { Spec, unitTests } from './__mocks__';

@suite('@biorate/mocha-spec - unit')
class MochaUnitSpec extends Spec {
  @test('all-expects-positive')
  protected async allExpectsPositive() {
    await this.unit({
      context: unitTests,
      method: 'increment',
      args: [3],
      expects: {
        context: true,
        args: true,
        return: true,
      },
    });
  }

  @test('all-expects-negative')
  protected async allExpectsNegative() {
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

  @test('custom-expects-positive')
  protected async customExpectsPositive() {
    await this.unit({
      context: unitTests,
      method: 'passthrow',
      args: [3, 2],
      expects: {
        context: ['dec'],
        args: ['[0]', '[1]'],
        return: ['a'],
      },
    });
  }
}
