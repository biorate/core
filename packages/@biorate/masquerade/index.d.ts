import type { JsonMask2Configs } from 'maskdata';

declare module '@biorate/masquerade' {
  // Class declaration inside the module
  class Mask {
    protected config?: JsonMask2Configs;

    /**
     * Checks if data masking is enabled
     */
    readonly enabled: boolean;

    /**
     * Configures masking parameters
     * @param config Masking configuration
     */
    configure(config: JsonMask2Configs): void;

    /**
     * Applies data masking
     * @param data Object to mask
     * @returns Masked object
     */
    processJSON<T extends object>(data: T): T;
  }

  // Export mask instance
  export const mask: Mask;

  // Re-export ALL exports from maskdata
  export * from 'maskdata';
}
