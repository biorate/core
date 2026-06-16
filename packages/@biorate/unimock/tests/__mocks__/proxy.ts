import { ProxyConnector as RawProxyConnector } from '@biorate/proxy';
import { Mockable } from '../../src';

@Mockable({})
export class ProxyConnector extends RawProxyConnector {
  protected stats() {
    // no-op: prevent second this.config access during initialize
    // that would overwrite the config getter snapshot refId
  }
}
