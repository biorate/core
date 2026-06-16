export class TestService {
  public async query(sql: string): Promise<{ data: number[] }> {
    return { data: [1, 2, 3] };
  }

  public get value(): string {
    return 'real-value';
  }

  public async subscribe(
    topic: string,
    handler: (msg: string) => Promise<void>,
  ): Promise<void> {
    await handler(`message-from-${topic}`);
  }
}

export class Connector {
  private conn = { query: async (sql: string) => [{ result: sql }] };
  public get() {
    return this.conn;
  }
}

export class ConnectorWithConnection {
  private conn = { query: async (sql: string) => [{ result: sql }] };
  public connection() {
    return this.conn;
  }
  public async query(sql: string) {
    const conn = this.connection();
    return conn.query(sql);
  }
}
