/**
 * @description Mock connection object for testing
 */
export class MockConnection {
  public name: string;
  public data: Map<string, any>;

  constructor(name: string) {
    this.name = name;
    this.data = new Map<string, any>();

    // Bind methods to ensure this works with proxies
    this.query = this.query.bind(this);
    this.execute = this.execute.bind(this);
    this.fetch = this.fetch.bind(this);
    this.store = this.store.bind(this);
  }

  async query(sql: string): Promise<any[]> {
    // Simulate database response
    return [{ result: 1, sql }];
  }

  async execute(command: string): Promise<boolean> {
    return true;
  }

  async fetch(key: string): Promise<any> {
    return this.data.get(key) || null;
  }

  async store(key: string, value: any): Promise<void> {
    this.data.set(key, value);
  }
}

/**
 * @description Mock connector for testing (standalone, no base class dependencies)
 */
export class TestConnector {
  public namespace: string = 'TestConnector';
  private connectionsMap = new Map<string, MockConnection>();
  private currentConnection: MockConnection | undefined;

  async create(config: { name: string }): Promise<MockConnection> {
    const connection = new MockConnection(config.name);
    this.connectionsMap.set(config.name, connection);
    if (!this.currentConnection) {
      this.currentConnection = connection;
    }
    return connection;
  }

  public get connections() {
    return this.connectionsMap;
  }

  public get current() {
    return this.currentConnection;
  }

  public use(name: string) {
    if (!this.connectionsMap.has(name)) {
      throw new Error(`Connection ${name} does not exist`);
    }
    this.currentConnection = this.connectionsMap.get(name);
  }

  public connection(name?: string): MockConnection {
    if (!name) return this.currentConnection!;
    const conn = this.connectionsMap.get(name);
    if (!conn) throw new Error(`Connection ${name} does not exist`);
    return conn;
  }

  public get(name?: string) {
    return this.connection(name);
  }
}
