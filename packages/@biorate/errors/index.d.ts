declare module '@biorate/errors' {
  export class BaseError extends Error {
    public constructor(message: string, args?: any[], meta?: any);
    public get meta(): any;
    public get code(): string;
  }
}
