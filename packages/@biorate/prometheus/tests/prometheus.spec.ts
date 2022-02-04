import { expect } from 'chai';
import { container } from '@biorate/inversion';
// import { Prometheus } from '../';
import { Root } from './index.config';

describe('Prometheus', function () {
  let root: Root;
  this.timeout(3e4);

  before(async () => {
    root = container.get<Root>(Root);
    await root.$run();
  });

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
