import { suite, test } from '@biorate/vitest';
import { Spec, UnitTests } from './__mocks__';

@suite('@biorate/vitest-spec - unit', { mode: 'serial' })
class VitestUnitSpec extends Spec {
  @test('all-expects-positive')
  protected async allExpectsPositive() {
    const unitTests = new UnitTests();
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
    const unitTests = new UnitTests();
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
    const unitTests = new UnitTests();
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
