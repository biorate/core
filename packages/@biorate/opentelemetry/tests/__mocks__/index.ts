import './env';
import { CardMask, EmailMask, Masquerade, PhoneMask } from '@biorate/masquerade';
import { trace } from '@opentelemetry/api';
import { setTimeout } from 'timers/promises';

import { scope, span } from '../../src';

Masquerade.configure({
  maskJSON2: {
    emailFields: ['result.email', 'arguments.*'],
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
}
