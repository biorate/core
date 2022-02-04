import { injectable, init, inject, Types } from '@biorate/inversion';
import { IConfig } from '@biorate/config';
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

  /**
   * @description Find or create metrics factory
   */
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

  /**
   * @example
   * ```ts
   * import { counter, Counter } from '@biorate/prometheus';
   *
   * class Test {
   *   @counter({
   *     name: 'test_counter',
   *     help: 'Test counter',
   *     labelNames: ['label1', 'label2'],
   *   })
   *   protected counter: Counter;
   *
   *   public metric() {
   *     this.counter.labels({ label1: 1, label2: 2 }).inc();
   *   }
   * }
   *
   * const test = new Test();
   *
   * test.metric();
   * ```
   */
  public static counter(settings: CounterConfiguration<string>) {
    return this.findOrCreate<Counter<string>, CounterConfiguration<string>>(
      settings,
      this.counters,
      Counter,
    );
  }

  /**
   * @example
   * ```ts
   * import { gauge, Gauge } from '@biorate/prometheus';
   *
   * class Test {
   *   @gauge({
   *     name: 'test_gauge',
   *     help: 'Test gauge',
   *     labelNames: ['label1', 'label2'],
   *   })
   *   protected gauge: Gauge;
   *
   *   public metric() {
   *     this.gauge.labels({ label1: 1, label2: 2 }).set(10);
   *   }
   * }
   *
   * const test = new Test();
   *
   * test.metric();
   * ```
   */
  public static gauge(settings: GaugeConfiguration<string>) {
    return this.findOrCreate<Gauge<string>, GaugeConfiguration<string>>(
      settings,
      this.gauges,
      Gauge,
    );
  }

  /**
   * @example
   * ```ts
   * import { histogram, Histogram } from '@biorate/prometheus';
   *
   * class Test {
   *   @histogram({
   *     name: 'test_histogram',
   *     help: 'Test histogram',
   *     labelNames: ['label1', 'label2'],
   *   })
   *   protected histogram: Histogram;
   *
   *   public metric() {
   *     this.histogram.labels({ label1: 1, label2: 2 }).observe(10);
   *   }
   * }
   *
   * const test = new Test();
   *
   * test.metric();
   * ```
   */
  public static histogram(settings: HistogramConfiguration<string>) {
    return this.findOrCreate<Histogram<string>, HistogramConfiguration<string>>(
      settings,
      this.histograms,
      Histogram,
    );
  }

  /**
   * @example
   * ```ts
   * import { summary, Summary } from '@biorate/prometheus';
   *
   * class Test {
   *   @histogram({
   *     name: 'test_summary',
   *     help: 'Test summary',
   *     labelNames: ['label1', 'label2'],
   *   })
   *   protected summary: Summary;
   *
   *   public metric() {
   *     this.summary.labels({ label1: 1, label2: 2 }).observe(10);
   *   }
   * }
   *
   * const test = new Test();
   *
   * test.metric();
   * ```
   */
  public static summary(settings: SummaryConfiguration<string>) {
    return this.findOrCreate<Summary<string>, SummaryConfiguration<string>>(
      settings,
      this.summaries,
      Summary,
    );
  }

  /**
   * @description Registry link getter
   */
  public get registry() {
    return Prometheus.registry;
  }

  @init() protected async initialize() {
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
