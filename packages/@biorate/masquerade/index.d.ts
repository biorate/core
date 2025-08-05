import type { JsonMask2Configs } from 'maskdata';

declare module '@biorate/masquerade' {
  // Class declaration inside the module
  export class Masquerade {
    protected static config: JsonMask2Configs | null;

    /**
     * Checks if data masking is enabled
     * @returns True if masking configuration is present
     */
    public static get enabled(): boolean;

    /**
     * Configures data masking parameters
     * @param config Masking configuration object
     */
    public static configure(config: JsonMask2Configs): void;

    /**
     * Applies data masking to JSON objects
     * @param data Input data to be masked
     * @returns Masked data object
     * @template T Type of input data
     */
    public static processJSON<T extends object>(data: T): T;

    /** @internal Dependency injected configuration */
    protected config: IConfig;

    /** @internal Initializer hook */
    protected initialize(): void;
  }

  // Re-export ALL exports from maskdata
  export * from 'maskdata';
}
