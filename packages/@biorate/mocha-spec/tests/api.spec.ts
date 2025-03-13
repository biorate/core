import * as nock from 'nock';
import { suite, test, only } from '@biorate/mocha';
import { IsNumber, IsString, IsBoolean } from 'class-validator';
import { Spec } from './__mocks__';
import { validate } from '../src';

@suite('@biorate/mocha-spec - api')
class MochaApiSpec extends Spec {
  @only
  @test('get')
  protected async get() {
    class Response {
      @IsNumber()
      public b: number;

      @IsString()
      public c: string;

      @IsBoolean()
      public d: boolean;
    }

    nock('http://test.local')
      .post('/')
      .query({ a: 1 })
      .reply(500, { b: 1, c: 'test', d: false });

    await this.api('http://test.local')
      .post('/')
      .query({ a: 1 })
      .send({ b: 1 })
      .then(validate(Response));
  }
}
