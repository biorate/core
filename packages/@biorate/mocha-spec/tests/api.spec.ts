import nock from 'nock';
import { suite, test, only } from '@biorate/mocha';
import { IsNumber, IsString, IsBoolean } from 'class-validator';
import { Spec } from './__mocks__';
import { validate, exactly } from '../src';

@suite('@biorate/mocha-spec - api')
class MochaApiSpec extends Spec {
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

    /*
      .send({ b: 1 }) - for 'application/json'
      .send('name=john') - for 'x-www-form-urlencoded' upload,
      .field('complex_object', '{ "attribute": "value" }', { contentType: 'application/json' }) - for example multipart file uploads!
      .attach('avatar', 'test/fixtures/avatar.jpg') - for file attach
      .set('Cookie', ['nameOne=valueOne;nameTwo=valueTwo']) - for cookies set
    */
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
