import { use } from 'chai';
import { jestSnapshotPlugin } from 'mocha-chai-jest-snapshot';
import { inject, container, Types, Core } from '@biorate/inversion';
import { IConfig, Config } from '@biorate/config';
import {
  Prometheus,
  IPrometheus,
  counter,
  gauge,
  summary,
  histogram,
  Counter,
  Gauge,
  Summary,
  Histogram,
} from '../';

use(jestSnapshotPlugin());

Core.log = null;

export class Root extends Core() {
  @inject(Types.Config) public config: IConfig;
  @inject(Types.Prometheus) public prometheus: IPrometheus;

  @counter({ name: 'counter', help: 'counter' }) public counter: Counter;
  @gauge({ name: 'gauge', help: 'gauge' }) public gauge: Gauge;
  @summary({ name: 'summary', help: 'summary' }) public summary: Summary;
  @histogram({ name: 'histogram', help: 'histogram' })
  public histogram: Histogram;
}
container.bind(Types.Config).to(Config).inSingletonScope();
container.bind(Types.Prometheus).to(Prometheus).inSingletonScope();
container.bind(Root).toSelf().inSingletonScope();

(container.get(Types.Config) as IConfig).merge({
  prometheus: {
    collectDefaultMetrics: false,
  },
});
