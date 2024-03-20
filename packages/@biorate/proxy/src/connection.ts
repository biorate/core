import { Server, Socket } from 'net';
import { EventEmitter } from 'events';
import { events, timer } from '@biorate/tools';
import { Axios } from '@biorate/axios';
import { ProxyConnectionTimeoutError } from './errors';
import { IProxyConfig, IClientOption } from './interfaces';

class Ping extends Axios {
  public static fetch(baseURL: string) {
    return this._fetch<unknown>({ baseURL });
  }
}

export class ProxyConnection {
  public static async create(config: IProxyConfig) {
    const proxy = new this(config);
    await proxy.connect();
    await proxy.listen();
    proxy.check().catch(() => process.kill(process.pid, 'SIGINT'));
    return proxy;
  }

  protected config: IProxyConfig;

  protected server: Server;

  protected socket: Socket;

  protected client: IClientOption;

  protected constructor(config: IProxyConfig) {
    this.config = config;
  }

  protected async listen() {
    this.server = new Server(this.config.server.options);
    this.server.listen(this.config.server.address);
    await events.once(<EventEmitter>this.server, 'listening');
    this.server.on('connection', async (socket) => {
      const client = new Socket(this.client.options);
      client.connect(this.client.address);
      client.pipe(socket);
      socket.pipe(client);
    });
  }

  protected async check() {
    if (!this.config.checkInterval) return;
    while (true) {
      await this.connect();
      await timer.wait(this.config.checkInterval);
    }
  }

  protected async connect() {
    let i = 0;
    w: while (true) {
      for (const client of this.config.clients) {
        let status: number;
        try {
          if (client.liveness) ({ status } = await Ping.fetch(client.liveness));
          else status = 200;
        } catch {
          continue;
        }
        if (status !== 200) continue;
        if (this.client === client) break w;
        this.client = client;
        console.debug(
          `Proxy connection selected: %s:%s`,
          client.address.host,
          client.address.port,
        );
        break w;
      }
      console.debug(`Attempt to select proxy connection: [%s]`, this.config.name);
      await timer.wait(this.config.timeout ?? 1000);
      ++i;
      if (i > (this.config.retry ?? 10))
        throw new ProxyConnectionTimeoutError(this.config.name);
    }
  }
}
