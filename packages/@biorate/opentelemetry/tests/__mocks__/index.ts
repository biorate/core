import { CardMask, EmailMask, Masquerade, PhoneMask } from '@biorate/masquerade';
import { trace } from '@opentelemetry/api';
import { setTimeout } from 'timers/promises';

process.env.OTEL_BSP_SCHEDULE_DELAY = '1000';
process.env.OTEL_BSP_EXPORT_TIMEOUT = '2000';
process.env.OTEL_LOG_LEVEL = 'warn';
process.env.OTEL_METRICS_EXPORTER = 'console';
process.env.OTEL_KUBE_NODE_NAME = 'localhost';
process.env.OTEL_SERVICE_NAME = 'test-app';
process.env.OTEL_TRACES_SAMPLER = 'always_on';
process.env.OTEL_TRACES_SAMPLER_ARG = '1';
process.env.OTEL_PROPAGATORS = 'tracecontext,baggage';
process.env.OTEL_EXPORTER_OTLP_ENDPOINT = 'http://localhost:4317';
process.env.OTEL_NODE_IP = 'localhost';
process.env.OTEL_RESOURCE_ATTRIBUTES_NODE_NAME = 'application-nodes';
process.env.OTEL_RESOURCE_ATTRIBUTES =
  'k8s.container.name=app,k8s.deployment.name=app,k8s.namespace.name=test,k8s.node.name=application-nodes,k8s.pod.name=app,k8s.replicaset.name=app,service.instance.id=test.app,service.version=develop';
process.env.OTEL_POD_IP = 'localhost';
process.env.OTEL_RESOURCE_ATTRIBUTES_POD_NAME = 'app';

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
