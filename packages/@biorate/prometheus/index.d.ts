import {
  Registry,
  Counter,
  CounterConfiguration,
  Gauge,
  GaugeConfiguration,
  Histogram,
  HistogramConfiguration,
  Summary,
  SummaryConfiguration,
} from 'prom-client';
import { IConfig } from '@biorate/config';
import { IPrometheus } from './src';

declare module '@biorate/prometheus' {
  export { Counter, Gauge, Summary, Histogram } from 'prom-client';

  export class Prometheus implements IPrometheus {
    public static readonly registry: Registry;
    protected static readonly counters: Map<string, Counter<string>>;
    protected static readonly gauges: Map<string, Gauge<string>>;
    protected static readonly histograms: Map<string, Histogram<string>>;
    protected static readonly summaries: Map<string, Summary<string>>;
    protected readonly config: IConfig;
    /**
     * @description Find or create metrics factory
     */
    protected static findOrCreate<T, S>(
      settings: S & { name: string },
      repository: Map<string, T>,
      Class: new (options: S) => T,
    ): (proto: any, key: string) => void;
    /**
     * @alias counter
     */
    public static counter(
      settings: CounterConfiguration<string>,
    ): (proto: any, key: string) => void;
    /**
     * @alias gauge
     */
    public static gauge(
      settings: GaugeConfiguration<string>,
    ): (proto: any, key: string) => void;
    /**
     * @alias histogram
     */
    public static histogram(
      settings: HistogramConfiguration<string>,
    ): (proto: any, key: string) => void;
    /**
     * @alias summary
     */
    public static summary(
      settings: SummaryConfiguration<string>,
    ): (proto: any, key: string) => void;
    /**
     * @description Registry link getter
     */
    public get registry(): Registry;
    /**
     * @description Initialize
     */
    protected initialize(): Promise<void>;
  }

  export const counter: (
    settings: CounterConfiguration<string>,
  ) => (proto: any, key: string) => void;

  export const gauge: (
    settings: GaugeConfiguration<string>,
  ) => (proto: any, key: string) => void;

  export const histogram: (
    settings: HistogramConfiguration<string>,
  ) => (proto: any, key: string) => void;

  export const summary: (
    settings: SummaryConfiguration<string>,
  ) => (proto: any, key: string) => void;
}
