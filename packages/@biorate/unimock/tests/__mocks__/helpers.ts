import { inject, container, Types, Core } from '@biorate/inversion';
import { IConfig } from '@biorate/config';
import { Server as HTTPServer } from 'http';
import { Server as TCPServer } from 'net';
import { SnapshotStore, MODE_REPLAY } from '../../src';

export function createMockSetup<T extends new (...args: any[]) => any>(
  ConnectorClass: T,
  configSection: Record<string, any>,
) {
  type ConnectorType = InstanceType<T>;
  class Root extends Core() {
    @inject(ConnectorClass) public connector!: ConnectorType;
  }
  return {
    async setup() {
      container.get<IConfig>(Types.Config).merge(configSection);
      container.bind(ConnectorClass).toSelf().inSingletonScope();
      container.bind(Root).toSelf().inSingletonScope();
      const root = container.get<Root>(Root);
      await root.$run();
      return root as { connector: ConnectorType };
    },
    teardown() {
      container.unbind(Root);
      if (container.isBound(ConnectorClass)) container.unbind(ConnectorClass);
    },
  };
}

export function createTestServers(httpPort: number, clientPort: number) {
  let http: HTTPServer | undefined;
  let tcp: TCPServer | undefined;
  return {
    startServers() {
      if (SnapshotStore.mode !== MODE_REPLAY) {
        http = new HTTPServer();
        http.listen(httpPort);
        http.on('request', (_, res) => {
          res.writeHead(200);
          res.end('1');
        });
        tcp = new TCPServer();
        tcp.listen(clientPort);
        tcp.on('connection', (socket) =>
          socket.on('data', (data) => socket.write(`${data} world!`)),
        );
      }
    },
    stopServers() {
      http?.close();
      tcp?.close();
    },
  };
}
