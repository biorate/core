import { suite, test } from '@biorate/mocha';
import { Spec } from './__mocks__';

@suite('@biorate/mocha-spec - exactly')
class MochaExactlySpec extends Spec {
  @test('exactly 1 - 1')
  protected exactly1by1() {
    this.exactly(1, 1);
  }

  @test('exactly obj - obj')
  protected exactlyObjbyObj() {
    this.exactly({ a: 1 }, { a: 1 });
  }

  @test('exactly negative obj - obj')
  protected exactlyObjbyObjNeg() {
    try {
      this.exactly({ a: 1, b: 2 }, { a: 1 });
    } catch (e) {}
  }
}
