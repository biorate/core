import {
  BasicTracerProvider,
  InMemorySpanExporter,
  SimpleSpanProcessor,
} from '@opentelemetry/sdk-trace-base';
import { trace } from '@opentelemetry/api';
import { setTimeout } from 'timers/promises';
import { scope, span } from '../../src/decorators';

export const exporter = new InMemorySpanExporter();

const provider = new BasicTracerProvider({
  spanProcessors: [new SimpleSpanProcessor(exporter)],
});

trace.setGlobalTracerProvider(provider);

@scope('exclude-test')
export class TestExclude {
  @span()
  public noExclude(a: number, b: number) {
    return { result: 'data', password: 'supersecret' };
  }

  @span({ exclude: ['arguments', 'result'] })
  public excludeAll(data: unknown) {
    return { token: 'secret' };
  }

  @span({ exclude: ['arguments.0.password'] })
  public excludeArgField(data: { password: string; name: string }) {
    return { name: data.name, role: 'admin' };
  }

  @span({ exclude: ['result.token', 'result.nested.secret'] })
  public excludeResultFields(data: unknown) {
    return {
      token: 'abc123',
      nested: { secret: 'classified', visible: 'ok' },
      normal: 'hello',
    };
  }

  @span({ exclude: ['arguments.*.creditCard'] })
  public excludeWildcard(user: { name: string; creditCard: string }) {
    return { status: 'ok' };
  }

  @span({ exclude: ['arguments.**.creditCard'] })
  public excludeGlobstar(nested: { deep: { creditCard: string } }) {
    return { status: 'ok' };
  }

  @span({ exclude: ['result.token'] })
  public async asyncExclude(data: unknown) {
    await setTimeout(10);
    return { token: 'async-token', data: 'public' };
  }
}
