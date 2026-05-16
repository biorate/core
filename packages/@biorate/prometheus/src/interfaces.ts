import {
  Registry,
  // Counter as PrometheusCounter,
  // Gauge as PrometheusGauge,
  // Histogram as PrometheusHistogram,
  // Summary as PrometheusSummary,
} from 'prom-client';

/** @description Prometheus registry wrapper interface. */
export interface IPrometheus {
  readonly registry: Registry;
}
/** @description Default metric settings interface for Prometheus metrics. */
export interface IdefaultSettings {
  name: string;
  override?: boolean;
}
// export type Counter = PrometheusCounter<string>;
// export type Gauge = PrometheusGauge<string>;
// export type Histogram = PrometheusHistogram<string>;
// export type Summary = PrometheusSummary<string>;
