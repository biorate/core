import { init } from '@biorate/inversion';
import { ProxyConnector as RawProxyConnector } from '@biorate/proxy-prometheus';
import { Mockable } from '../../src';

@Mockable({})
export class ProxyConnector extends RawProxyConnector {
  @init() protected async initialize() {
    await super.initialize();
    // metrics() intentionally skipped via arrow-function override below
  }

  protected stats() {
    // no-op: prevent second this.config access during initialize
  }

  // instance property (not on prototype) to bypass Mockable wrapping
  // and avoid while-true loop / Promise-catch issues in replay
  protected metrics = async () => {};
}
