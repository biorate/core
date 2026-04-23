import nock from 'nock';
import { suite, test } from '@biorate/vitest';
import { IsNumber, IsString, IsBoolean } from 'class-validator';
import { Spec } from './__mocks__';
import { validate, exactly } from '../src';

@suite('@biorate/vitest-spec - api')
class VitestApiSpec extends Spec {
  @test('validation')
  protected validation() {
    class Response {
      @IsNumber()
      public b: number;

      @IsString()
      public c: string;

      @IsBoolean()
      public d: boolean;
    }

    const query = { a: 1 };
    const data = { b: 1, c: 'test', d: false };
    const code = 500;
    const header = {
      key: 'x-custom-header',
      val: 'hello world!',
    };

    nock('http://test.local')
      .post('/')
      .query(query)
      .reply(code, data, { [header.key]: header.val });

    return this.api('http://test.local')
      .post('/')
      .query(query)
      .set('Accept', 'application/json')
      .auth('username', 'password')
      .send({ b: 1 })
      .expect('Content-Type', /json/)
      .expect(header.key, header.val)
      .expect(code)
      .then(validate(Response))
      .then(exactly(data));
  }
}
