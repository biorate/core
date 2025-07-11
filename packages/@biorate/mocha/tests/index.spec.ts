import './setup';
import { suite, test, timeout, parallel, Done, Context } from '../src';
import { Scenario1, Scenario2 } from './scenarios';

@suite('serial')
@parallel(false)
@timeout(5000)
class Serial {
  protected static before() {
    console.log('before');
  }

  protected static after() {
    console.log('after');
  }

  @test('test1')
  protected test1(done: Done) {
    console.log('test1');
    setTimeout(done, 100);
  }

  @test('test2')
  protected test2(done: Done) {
    console.log('test2');
    setTimeout(done, 100);
  }

  @test('test3')
  protected test3(done: Done) {
    console.log('test3');
    setTimeout(done, 100);
  }
}

@suite('parallel')
@parallel(true)
@timeout(5000)
class Parallel {
  protected static before() {
    console.log('before');
  }

  protected static after() {
    console.log('after');
  }

  @test('test1')
  protected test1(done: Done) {
    console.log('test1');
    setTimeout(done, 100);
  }

  @test('test2')
  protected test2(done: Done) {
    console.log('test2');
    setTimeout(done, 100);
  }

  @test('test3')
  protected test3(done: Done) {
    console.log('test3');
    setTimeout(done, 100);
  }
}

@suite('serial')
@parallel(false)
@timeout(5000)
class Scenario {
  @test('scenario1')
  protected async scenario1() {
    await Context.run([Scenario1, Scenario2]);
  }
}
