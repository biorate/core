import { expect } from 'vitest';
import { container } from '@biorate/inversion';
import { Root, root } from './__mocks__';

describe('Prometheus', () => {
  beforeAll(async () => await root.$run());

  it('counter', async () => {
    root.counter.inc();
    expect(await root.prometheus.registry.metrics()).toMatchSnapshot();
  });

  it('gauge', async () => {
    root.gauge.inc();
    expect(await root.prometheus.registry.metrics()).toMatchSnapshot();
  });

  it('summary', async () => {
    root.summary.observe(1);
    expect(await root.prometheus.registry.metrics()).toMatchSnapshot();
  });

  it('histogram', async () => {
    root.histogram.observe(1);
    expect(await root.prometheus.registry.metrics()).toMatchSnapshot();
  });
});
