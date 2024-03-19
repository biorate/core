import { use } from 'chai';
import { jestSnapshotPlugin } from 'mocha-chai-jest-snapshot';
import { inject, container, Types, Core } from '@biorate/inversion';
import { IConfig, Config } from '@biorate/config';
import { HaproxyConnector } from '../../src';

use(jestSnapshotPlugin());

export class Root extends Core() {
  @inject(HaproxyConnector) public connector: HaproxyConnector;
}

container.bind<IConfig>(Types.Config).to(Config).inSingletonScope();
container.bind<HaproxyConnector>(HaproxyConnector).toSelf().inSingletonScope();
container.bind<Root>(Root).toSelf().inSingletonScope();

container.get<IConfig>(Types.Config).merge({
  Haproxy: [
    {
      name: 'connection',
      debug: false,
      /*readiness: {
        nodes: ['postgresql1', 'postgresql2', 'postgresql3'],
        retries: 10,
        delay: 1000,
      },*/
      config: {
        global: [
          'maxconn 100',
          'stats socket {{stat_socket_path}} mode 660 level admin expose-fd listeners',
          'stats timeout 5s',
        ],
        defaults: [
          'log global',
          'retries 2',
          'timeout client 30m',
          'timeout connect 4s',
          'timeout server 30m',
          'timeout check 5s',
        ],
        'listen stats': ['mode http', 'bind *:7001', 'stats enable', 'stats uri /'],
        'listen postgres': [
          'mode tcp',
          'bind *:7000',
          'option httpchk',
          'http-check expect status 200',
          'default-server inter 3s fall 3 rise 2 on-marked-down shutdown-sessions',
          'server postgresql1 127.0.0.1:5433 maxconn 100 check port 8008',
          'server postgresql2 127.0.0.1:5434 maxconn 100 check port 8008',
          'server postgresql3 127.0.0.1:5435 maxconn 100 check port 8008',
        ],
      },
    },
  ],
});

export const root = <Root>container.get<Root>(Root);
