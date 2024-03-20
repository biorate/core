import { unlinkSync } from 'fs';
import { Server, Socket } from 'net';
import { EventEmitter } from 'events';
import { events, timer } from '@biorate/tools';
import { ProxyConnectionTimeoutError } from './errors';
import { Ping } from './ping';
import { IProxyConfig, IClientOption } from './interfaces';

export class ProxyConnection {
  public static async create(config: IProxyConfig) {
    const proxy = new this(config);
    await proxy.select();
    await proxy.listen();
    proxy.check().catch(() => process.kill(process.pid, 'SIGINT'));
    return proxy;
  }

  protected config: IProxyConfig;

  protected server: Server;

  protected socket: Socket;

  protected client: IClientOption;

  protected writed = 0;

  protected readed = 0;

  protected constructor(config: IProxyConfig) {
    this.config = config;
  }

  protected async listen() {
    this.server = new Server(this.config.server.options);
    this.server.on('connection', (socket) => {
      const client = new Socket(this.client.options);
      client.connect(this.client.address);
      client.pipe(socket);
      socket.pipe(client);
      client.on('data', (data) => (this.readed += Buffer.byteLength(data)));
      socket.on('data', (data) => (this.writed += Buffer.byteLength(data)));
    });
    if (this.config.server.address.path) {
      try {
        unlinkSync(this.config.server.address.path);
      } catch {}
    }
    this.server.listen(this.config.server.address);
    await events.once(<EventEmitter>this.server, 'listening');
  }

  protected async check() {
    if (!this.config.checkInterval || this.config.checkInterval < 0) return;
    while (true) {
      await this.select();
      await timer.wait(this.config.checkInterval);
    }
  }

  protected async select() {
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
        this.readed = 0;
        this.writed = 0;
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

  public isActive(client: IClientOption) {
    return this.client === client;
  }

  public get stat() {
    return { writed: this.writed, readed: this.readed };
  }
}
