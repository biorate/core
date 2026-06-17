import { ProxyConnector as RawProxyConnector } from '@biorate/proxy';
import { Mockable } from '../../src';
import { createMockSetup, createTestServers } from './helpers';

@Mockable({})
export class ProxyConnector extends RawProxyConnector {
  protected stats() {
    // no-op: prevent second this.config access during initialize
  }
}

export const { startServers, stopServers } = createTestServers(18101, 17101);

export const httpPort = 18101;
export const clientPort = 17101;
export const serverPort = 17102;

const config = {
  Proxy: [
    {
      name: 'connection',
      retry: 10,
      server: { address: { host: 'localhost', port: serverPort } },
      clients: [
        {
          liveness: `http://localhost:${httpPort}`,
          address: { host: 'localhost', port: clientPort },
        },
      ],
    },
  ],
};

export const { setup, teardown } = createMockSetup(ProxyConnector, config);
