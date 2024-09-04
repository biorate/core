import { ProxyConnector as BaseProxyConnector } from '@biorate/proxy';

declare module '@biorate/proxy-prometheus' {
  export class ProxyConnector extends BaseProxyConnector {}
}
