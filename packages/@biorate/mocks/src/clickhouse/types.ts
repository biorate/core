import type { 
  QueryParams, 
  InsertParams, 
  ExecParams, 
  CommandParams,
  InsertResult 
} from '@clickhouse/client';

/**
 * @description ClickHouse call interface
 */
export interface ClickHouseCall {
  method: 'query' | 'insert' | 'exec' | 'command' | 'close';
  args: any[];
  timestamp: number;
}

/**
 * @description Mock QueryResult for ClickHouse
 */
export interface MockClickHouseQueryResult<T> {
  json(): Promise<{ data: T[]; query_id: string }>;
  text(): Promise<string>;
  [Symbol.asyncIterator](): AsyncIterator<T>;
}

/**
 * @description Parameters for query response configuration
 */
export interface QueryResponseOptions {
  query_id?: string;
}

/**
 * @description Parameters for insert response configuration
 */
export interface InsertResponseOptions {
  query_id?: string;
}

// Re-export types for convenience
export type { QueryParams, InsertParams, ExecParams, CommandParams, InsertResult };
