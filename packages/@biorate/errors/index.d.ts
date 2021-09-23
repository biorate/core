declare module '@biorate/errors' {
  export class BaseError extends Error {
    public constructor(message: string, args?: unknown[], meta?: unknown, ...options: unknown[]);
    public get meta(): any;
    public get code(): string;
  }
}

