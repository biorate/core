import { init, injectable } from '@biorate/inversion';
import { timer } from '@biorate/tools';
import { gauge, Gauge } from '@biorate/prometheus';
import { ProxyConnector as BaseProxyConnector } from '@biorate/proxy';

export type * from '@biorate/proxy';

/**
 * @description Proxy connector with prometheus metrics
 *
 * ### Features:
 * - see [@biorate/proxy](https://biorate.github.io/core/modules/proxy.html) features
 * - prometheus metrics
 *
 * ### Examples
 * - see [@biorate/proxy](https://biorate.github.io/core/modules/proxy.html) examples
 */
@injectable()
export class ProxyConnector extends BaseProxyConnector {
  /**
   * @description write bytes metric
   */
  @gauge({
    name: 'proxy_connector_write_bytes',
    help: 'ProxyConnector write bytes',
    labelNames: ['connection', 'host'],
  })
  protected write: Gauge;
  /**
   * @description read bytes metric
   */
  @gauge({
    name: 'proxy_connector_read_bytes',
    help: 'ProxyConnector read bytes',
    labelNames: ['connection', 'host'],
  })
  protected read: Gauge;
  /**
   * @description initialize
   */
  @gauge({
    name: 'proxy_connector_active',
    help: 'ProxyConnector activity status',
    labelNames: ['connection', 'host'],
  })
  protected active: Gauge;
  /**
   * @description log metrics
   */
  protected async metrics() {
    while (true) {
      const stats = this.getStatData();
      for (const stat of stats) {
        this.write
          .labels({ connection: stat.connection, host: stat.backendHost })
          .set(stat.write);
        this.read
          .labels({ connection: stat.connection, host: stat.backendHost })
          .set(stat.read);
        this.active
          .labels({ connection: stat.connection, host: stat.backendHost })
          .set(stat.active ? 1 : 0);
      }
      await timer.wait(this.config.get<number>('ProxyStats.metricsInterval', 1000));
    }
  }
  /**
   * @description initialize
   */
  @init() protected async initialize() {
    await super.initialize();
    this.metrics().catch(console.warn);
  }
}
