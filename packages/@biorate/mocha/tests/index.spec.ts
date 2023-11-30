import { suite, test, timeout } from '../src';
import { Done } from 'mocha';

@suite('@biorate/mocha')
@timeout(5000)
class BiorateMocha {
  protected static async before(done: Done) {
    console.log('before');
    done();
  }

  @test('test1')
  protected test1(done: Done) {
    console.log('test1');
    done();
  }

  @test('test2')
  protected test2() {
    console.log('test2');
  }

  @test('test3')
  protected async test3() {
    console.log('test3');
  }
}
