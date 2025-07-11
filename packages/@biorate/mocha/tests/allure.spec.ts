import './setup';
import {
  suite,
  test,
  parallel,
  ContentType,
  Severity,
  description,
  epic,
  feature,
  issue,
  owner,
  severity,
  story,
  tag,
  testCaseId,
  allure,
  label,
} from '../src';

@suite('Allure')
@parallel(false)
class Allure {
  protected static async after() {
    allure.attachment('Test attachment', 'test attachment content', ContentType.TEXT);
  }

  @issue('1')
  @label('test1', 'test-1')
  @label('test2', 'test-2')
  @testCaseId('1')
  @severity(Severity.MINOR)
  @epic('HTTP API tests')
  @feature('Readiness')
  @story('Probe')
  @owner('60000000')
  @tag('api')
  @description('Readiness probe test.')
  @test('/probe/readiness (GET)')
  protected async allureTest() {
    console.log('allure test');
  }
}
