import { inject, container, Types, Core, init } from '@biorate/inversion';
import { IConfig } from '@biorate/config';
import { IPrometheus, Prometheus } from '@biorate/prometheus';
import { ProxyConnector as RawProxyConnector } from '@biorate/proxy-prometheus';
import { Mockable, SnapshotStore, MODE_REPLAY } from '../../src';
import { createTestServers } from './helpers';

@Mockable({})
export class ProxyConnector extends RawProxyConnector {
  @init() protected async initialize() {
    await super.initialize();
  }

  protected stats() {
    // no-op: prevent second this.config access during initialize
  }

  protected metrics = async () => {};
}

export const { startServers, stopServers } = createTestServers(28001, 27001);

export const httpPort = 28001;
export const clientPort = 27001;
export const serverPort = 27002;

class Root extends Core() {
  @inject(Prometheus) public prometheus: IPrometheus;
  @inject(ProxyConnector) public connector: ProxyConnector;
}

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

export async function setup() {
  if (!container.isBound(Prometheus))
    container.bind<IPrometheus>(Prometheus).to(Prometheus).inSingletonScope();
  container.get<IConfig>(Types.Config).merge(config);
  container.bind(ProxyConnector).toSelf().inSingletonScope();
  container.bind(Root).toSelf().inSingletonScope();
  const root = container.get<Root>(Root);
  await root.$run();
  return root as { connector: ProxyConnector };
}

export function teardown() {
  container.unbind(Root);
  if (container.isBound(ProxyConnector)) container.unbind(ProxyConnector);
}
