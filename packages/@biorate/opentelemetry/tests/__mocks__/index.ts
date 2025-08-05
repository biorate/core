process.env.OTEL_METRICS_EXPORTER = 'console';
process.env.OTEL_KUBE_NODE_NAME = 'localhost';
process.env.OTEL_SERVICE_NAME = 'test-app';
process.env.OTEL_TRACES_SAMPLER = 'always_on';
process.env.OTEL_TRACES_SAMPLER_ARG = '1';
process.env.OTEL_PROPAGATORS = 'tracecontext,baggage';
process.env.OTEL_EXPORTER_OTLP_ENDPOINT = 'http://localhost:14317';
process.env.OTEL_NODE_IP = 'localhost';
process.env.OTEL_RESOURCE_ATTRIBUTES_NODE_NAME = 'application-nodes';
process.env.OTEL_RESOURCE_ATTRIBUTES =
  'k8s.container.name=app,k8s.deployment.name=app,k8s.namespace.name=test,k8s.node.name=application-nodes,k8s.pod.name=app,k8s.replicaset.name=app,service.instance.id=test.app,service.version=develop';
process.env.OTEL_POD_IP = 'localhost';
process.env.OTEL_RESOURCE_ATTRIBUTES_POD_NAME = 'app';

import { Masquerade } from '@biorate/masquerade';
import { scope, span } from '../../src';

Masquerade.configure({
  emailFields: ['result.email', 'arguments.*'],
});

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
    return { email: 'out@mail.com' };
  }
}
