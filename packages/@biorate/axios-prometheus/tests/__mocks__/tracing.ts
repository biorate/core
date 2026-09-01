import {
  BasicTracerProvider,
  InMemorySpanExporter,
  SimpleSpanProcessor,
} from '@opentelemetry/sdk-trace-base';
import { trace } from '@opentelemetry/api';
import { container, Types } from '@biorate/inversion';
import { IConfig, Config } from '@biorate/config';
import { AxiosPrometheus } from '../../src';

export const exporter = new InMemorySpanExporter();

export const URL = 'https://google.com';

const provider = new BasicTracerProvider({
  spanProcessors: [new SimpleSpanProcessor(exporter)],
});

export function enableInMemoryTracing() {
  trace.disable();
  trace.setGlobalTracerProvider(provider);
}

container.bind(Types.Config).to(Config).inSingletonScope();

container.get<IConfig>(Types.Config).merge({
  baseURL: 'https://google.com',
});

export class TestService extends AxiosPrometheus {
  public baseURL = this.config.get<string>('baseURL');

  public url = '/';

  public method = 'get';

  public timeout = 1500;
}

export function setTracingExcluded(patterns: (string | RegExp)[]) {
  container.get<IConfig>(Types.Config).merge({
    AxiosPrometheus: { tracing: { excluded: patterns } },
  });
}
