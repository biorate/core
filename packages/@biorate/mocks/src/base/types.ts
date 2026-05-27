/** @description Base call interface for tracking method invocations */
export interface BaseCall {
  method: string;
  args: any[];
  timestamp: number;
}

/** @description Call history for a single method */
export interface CallHistory<T extends BaseCall = BaseCall> {
  calls: T[];
  callCount: number;
}
