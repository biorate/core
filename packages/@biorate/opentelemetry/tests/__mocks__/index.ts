import '../setup';
import { trace } from '@opentelemetry/api';
import { setTimeout } from 'timers/promises';
import './env';
import { scope, span } from '../../src';
import { CardMask, EmailMask, Masquerade, PhoneMask } from '@biorate/masquerade';

Masquerade.configure({
  maskJSON2: {
    emailFields: ['result.email', 'arguments.email'],
    passwordFields: ['password'],
  },
});

Masquerade.use(EmailMask).use(PhoneMask).use(CardMask);

@scope('v2')
export class Test {
  @span()
  public test1(a: number, b: number) {
    return { a, b };
  }

  @span()
  public test2(a: number, b: number) {
    return a + b;
  }

  @span()
  public test3(a: number, b: number) {
    throw new Error('test error');
  }

  @span()
  public test4(email: string) {
    const span = trace.getActiveSpan()!;
    span.setAttribute('password', '2swdasr434sdfgsdty76');
    span.setAttribute('card', '4500-5435-3213-2323');
    span.setAttribute('phone', '+79991231213');
    span.setAttribute('email', 'nobody@gmail.ru');
    return { email: 'out@mail.com' };
  }

  @span()
  public async test5(a: number) {
    await setTimeout(10);
    return 1;
  }

  @span({ name: 'noRequest', exclude: { request: ['secret', 'data'] } })
  public testOptionsNoRequest(secret: string, data: any) {
    return { received: true, secret: 'password123', data };
  }

  @span({ name: 'noResponse', exclude: { response: ['secret', 'data'] } })
  public testNoResult(a: number) {
    return { secret: 'password123', data: a };
  }

  @span({
    name: 'httpHandler',
    exclude: { request: ['body'] },
  })
  public testHttpHandler(req: { body: any; query: any; headers: any }) {
    return { statusCode: 200, headers: { 'content-type': 'application/json' } };
  }

  @span({
    name: 'noRequestNoResponse',
    exclude: { request: ['file'], response: [] },
  })
  public testBinaryFile(file: Buffer) {
    return Buffer.from('pdf-content');
  }

  @span({
    name: 'responseHandler',
    exclude: { response: ['body'] },
  })
  public testResponseHandler() {
    return {
      headers: { 'content-type': 'application/json' },
      statusCode: 200,
      body: 'response body',
    };
  }
}
