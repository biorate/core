import { injectable, init, inject, Types } from '@biorate/inversion';
import { IConfig } from '@payment/config';
import { IPrometheus } from './interfaces';
import {
  collectDefaultMetrics,
  Registry,
  DefaultMetricsCollectorConfiguration,
  Counter,
  CounterConfiguration,
  Gauge,
  GaugeConfiguration,
  Histogram,
  HistogramConfiguration,
  Summary,
  SummaryConfiguration,
} from 'prom-client';

export * from './interfaces';

@injectable()
export class Prometheus implements IPrometheus {
  public static readonly registry = new Registry();
  protected static readonly counters = new Map<string, Counter<string>>();
  protected static readonly gauges = new Map<string, Gauge<string>>();
  protected static readonly histograms = new Map<string, Histogram<string>>();
  protected static readonly summaries = new Map<string, Summary<string>>();
  @inject(Types.Config) protected readonly config: IConfig;

  protected static findOrCreate<T, S>(
    settings: S & { name: string },
    repository: Map<string, T>,
    Class: new (options: S) => T,
  ) {
    let metric = repository.get(settings.name);
    if (!metric) {
      metric = new Class({ ...settings, registers: [this.registry] });
      repository.set(settings.name, metric);
    }
    return (proto: any, key: string) =>
      Object.defineProperty(proto, key, {
        get: () => metric,
        configurable: true,
      });
  }

  public static counter(settings: CounterConfiguration<string>) {
    return this.findOrCreate<Counter<string>, CounterConfiguration<string>>(
      settings,
      this.counters,
      Counter,
    );
  }

  public static gauge(settings: GaugeConfiguration<string>) {
    return this.findOrCreate<Gauge<string>, GaugeConfiguration<string>>(
      settings,
      this.gauges,
      Gauge,
    );
  }

  public static histogram(settings: HistogramConfiguration<string>) {
    return this.findOrCreate<Histogram<string>, HistogramConfiguration<string>>(
      settings,
      this.histograms,
      Histogram,
    );
  }

  public static summary(settings: SummaryConfiguration<string>) {
    return this.findOrCreate<Summary<string>, SummaryConfiguration<string>>(
      settings,
      this.summaries,
      Summary,
    );
  }

  public get registry() {
    return Prometheus.registry;
  }

  @init() private async initialize() {
    if (this.config.get<boolean>('prometheus.collectDefaultMetrics', true))
      collectDefaultMetrics({
        ...this.config.get<DefaultMetricsCollectorConfiguration>(
          'prometheus.defaultMetrics',
          {},
        ),
        register: this.registry,
      });
  }
}

export const counter = Prometheus.counter.bind(Prometheus);
export const gauge = Prometheus.gauge.bind(Prometheus);
export const histogram = Prometheus.histogram.bind(Prometheus);
export const summary = Prometheus.summary.bind(Prometheus);
