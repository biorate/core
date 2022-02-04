import {
  Registry,
  Counter as PCounter,
  Gauge as PGauge,
  Histogram as PHistogram,
  Summary as PSummary,
} from 'prom-client';

export interface IPrometheus {
  readonly registry: Registry;
}

export type Counter = PCounter<string>;
export type Gauge = PGauge<string>;
export type Histogram = PHistogram<string>;
export type Summary = PSummary<string>;
