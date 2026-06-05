import { v4 as uuidv4 } from 'uuid';
import { CallRecord, SnapshotManager } from './snapshot';

export class CallChain {
  public readonly id: string;
  public readonly records: CallRecord[] = [];
  public readonly createdAt: number;

  constructor(id?: string) {
    this.id = id || uuidv4();
    this.createdAt = Date.now();
  }

  public addRecord(record: Omit<CallRecord, 'chainId' | 'timestamp'>): CallRecord {
    const callRecord: CallRecord = {
      ...record,
      chainId: this.id,
      timestamp: Date.now(),
    };
    this.records.push(callRecord);
    return callRecord;
  }

  public getResult(method: string): unknown {
    const record = this.records.find((r) => r.method === method);
    if (!record) {
      return undefined;
    }
    if (record.error) {
      const error = new Error(record.error.message);
      error.name = record.error.name;
      if (record.error.stack) {
        error.stack = record.error.stack;
      }
      throw error;
    }
    return record.result;
  }

  public hasRecord(method: string, args?: unknown[]): boolean {
    return this.records.some(
      (r) =>
        r.method === method && (!args || JSON.stringify(r.args) === JSON.stringify(args)),
    );
  }
}

export class ChainRecorder {
  private chains: Map<string, CallChain> = new Map();
  private currentChainId: string | null = null;

  constructor(
    private className: string,
    public readonly snapshotName: string,
    private snapshotManager: SnapshotManager,
  ) {}

  public startChain(): CallChain {
    const chain = new CallChain();
    this.chains.set(chain.id, chain);
    this.currentChainId = chain.id;
    return chain;
  }

  public getCurrentChain(): CallChain | null {
    if (!this.currentChainId) {
      return this.startChain();
    }
    let chain = this.chains.get(this.currentChainId);
    if (!chain) {
      chain = this.startChain();
    }
    return chain;
  }

  public recordCall(
    method: string,
    args: unknown[],
    result?: unknown,
    error?: Error,
  ): CallRecord {
    const chain = this.getCurrentChain()!;
    const record = chain.addRecord({
      method,
      args,
      result,
      error: error
        ? { name: error.name, message: error.message, stack: error.stack }
        : undefined,
    });
    this.snapshotManager.addCallRecord(
      this.className,
      this.snapshotName,
      chain.id,
      record,
    );
    return record;
  }

  public getChain(chainId: string): CallChain | null {
    return this.chains.get(chainId) || null;
  }

  public loadChain(chainId: string): CallChain | null {
    const records = this.snapshotManager.getChainRecords(
      this.className,
      this.snapshotName,
      chainId,
    );
    if (!records.length) {
      return null;
    }
    const chain = new CallChain(chainId);
    chain.records.push(...records);
    this.chains.set(chainId, chain);
    return chain;
  }

  public getFirstChainId(): string | null {
    const loadedSnapshot = this.snapshotManager.load(this.className, this.snapshotName);
    if (loadedSnapshot && Object.keys(loadedSnapshot.chains).length > 0) {
      return Object.keys(loadedSnapshot.chains)[0];
    }
    if (this.chains.size > 0) {
      return Array.from(this.chains.keys())[0];
    }
    return null;
  }

  public useChain(chainId: string): void {
    this.currentChainId = chainId;
  }

  public flush(): void {
    this.snapshotManager.flush();
  }
}
